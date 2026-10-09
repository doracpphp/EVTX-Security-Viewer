import { Buffer } from 'buffer';
import { parseEvtxFileAsync, type DataSource, type ParsedRecord } from 'winevtx';
import { createFileDataSource } from '../utils/fileDataSource';
import { getEventDescription } from '../utils/eventDefinitions';
import { classifyIsSystemUser } from '../utils/sidClassifier';
import { hasChunkMagic, chunkChecksumsValid } from '../utils/evtxChecksum';
import type { NormalizedEvent, WorkerMessage, WorkerResponse } from '../types/events';

// Make Buffer available globally (required by winevtx in browser)
(self as unknown as Record<string, unknown>).Buffer = Buffer;

const CHUNK_SIZE = 0x10000; // EVTX chunks are always 64 KiB

// Flush by time, not by record count: every flush re-renders the whole table
// and navigation, so flushing every 100 records made loading quadratic.
const FLUSH_INTERVAL_MS = 300;

function post(msg: WorkerResponse) {
  self.postMessage(msg);
}

/**
 * Yields every record in the file, skipping corrupted chunks.
 *
 * - winevtx does not bounds-check BinXML, so garbage in a chunk can make it
 *   allocate until the tab runs out of memory. Chunks whose CRC32 checksums
 *   don't match are therefore replaced with an empty buffer, which winevtx
 *   skips as "not a chunk".
 * - If parsing still throws, the generator is dead; restart it on a view of
 *   the file in which the failing chunk and everything before it are hidden.
 */
async function* parseRecords(
  src: DataSource,
  onBytesRead: (bytes: number) => void,
  onChunkSkipped: () => void,
): AsyncGenerator<ParsedRecord> {
  let shift = 0;              // bytes hidden between the file header and the first visible chunk
  let firstChunkOffset = -1;  // offset of chunk #0 (= header block size)
  for (;;) {
    const base = shift;
    let currentChunk = -1;    // real offset of the chunk being parsed
    const view: DataSource = {
      size: src.size - base,
      async readAt(offset, size) {
        if (offset === 0) return src.readAt(0, size); // file header
        if (firstChunkOffset < 0) firstChunkOffset = offset;
        currentChunk = offset + base;
        onBytesRead(currentChunk + size);
        const chunk = await src.readAt(currentChunk, size);
        if (hasChunkMagic(chunk) && !chunkChecksumsValid(chunk)) {
          onChunkSkipped();
          return Buffer.alloc(size);
        }
        return chunk;
      },
    };
    try {
      yield* parseEvtxFileAsync(view);
      return;
    } catch (err) {
      // Failing before any chunk was read means the file header itself is invalid.
      if (currentChunk < 0) throw err;
      onChunkSkipped();
      shift = currentChunk + CHUNK_SIZE - firstChunkOffset;
    }
  }
}

interface RawEvent {
  System?: {
    EventID?: number | { Value?: number };
    TimeCreated?: { SystemTime?: number };
    Computer?: string;
    Level?: number;
  };
  EventData?: Record<string, unknown>;
  UserData?: Record<string, unknown>;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// UserData wraps its fields in a provider-specific element,
// e.g. 1102 → { LogFileCleared: { SubjectUserName, ... } }.
function getEventData(ev: RawEvent): Record<string, unknown> {
  if (ev.EventData) return ev.EventData;
  const ud = ev.UserData;
  if (!ud) return {};
  const inner = Object.values(ud);
  return inner.length === 1 && isPlainObject(inner[0]) ? inner[0] : ud;
}

// Unix seconds → ISO 8601; corrupted records can carry out-of-range times.
function toIso(seconds: number | undefined): string {
  const d = new Date(Number(seconds) * 1000);
  return isNaN(d.getTime()) ? '' : d.toISOString();
}

function buildUser(name: unknown, domain: unknown): string | null {
  const n = String(name ?? '').trim();
  if (!n || n === '-') return null;
  const d = String(domain ?? '').trim();
  return d && d !== '-' ? `${d}\\${n}` : n;
}

function normalize(record: ParsedRecord): NormalizedEvent {
  // Actual structure: record.event.Event.System / record.event.Event.EventData
  const ev = (record.event as { Event?: RawEvent } | null)?.Event ?? {};
  const sys = ev.System ?? {};

  const eventId = Number(typeof sys.EventID === 'object' ? sys.EventID?.Value : sys.EventID) || 0;
  // SystemTime and record.timestamp are both Unix timestamps (float seconds)
  const timestamp = toIso(sys.TimeCreated?.SystemTime ?? record.timestamp);
  const eventData = getEventData(ev);

  // Prefer TargetUserName (actual logon target) over SubjectUserName (initiating account),
  // and classify with the SID of the same account.
  const target = buildUser(eventData['TargetUserName'], eventData['TargetDomainName']);
  const user = target ?? buildUser(eventData['SubjectUserName'], eventData['SubjectDomainName']) ?? '';
  const sid = String((target ? eventData['TargetUserSid'] : eventData['SubjectUserSid']) ?? '').trim();

  // LogonType / IpAddress are only present for logon events (4624, 4625)
  const isLogonEvent = eventId === 4624 || eventId === 4625;
  const logonType = isLogonEvent && eventData['LogonType'] != null
    ? Number(eventData['LogonType'])
    : undefined;
  const ipRaw = isLogonEvent ? String(eventData['IpAddress'] ?? '').trim() : '';

  return {
    id: record.recordID,
    eventId,
    timestamp,
    computer: sys.Computer ?? '',
    level: sys.Level ?? 0,
    user,
    description: getEventDescription(eventId),
    logonType,
    ipAddress: ipRaw && ipRaw !== '-' ? ipRaw : undefined,
    isSystemUser: classifyIsSystemUser(sid, user),
    raw: ev as Record<string, unknown>,
  };
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  if (e.data.type !== 'parse') return;
  const { file } = e.data;

  try {
    let batch: NormalizedEvent[] = [];
    let bytesRead = 0;
    let skippedChunks = 0;
    let lastFlush = performance.now();

    const flush = () => {
      if (batch.length > 0) {
        post({ type: 'events', events: batch });
        batch = [];
      }
      post({ type: 'progress', processed: bytesRead, total: file.size });
      lastFlush = performance.now();
    };

    const records = parseRecords(
      createFileDataSource(file),
      bytes => { bytesRead = bytes; },
      () => { skippedChunks++; },
    );
    for await (const record of records) {
      batch.push(normalize(record));
      if (performance.now() - lastFlush >= FLUSH_INTERVAL_MS) flush();
    }

    bytesRead = file.size;
    flush();
    post({ type: 'done', skippedChunks });
  } catch (err) {
    // Only expose the message, not the full stack trace
    post({ type: 'error', message: err instanceof Error ? err.message : '' });
  }
};
