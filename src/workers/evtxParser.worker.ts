import { Buffer } from 'buffer';
import { parseEvtxFileAsync, getChunksAsync } from 'winevtx';
import { createFileDataSource } from '../utils/fileDataSource';
import { getEventDescription } from '../utils/eventDefinitions';
import { classifyIsSystemUser } from '../utils/sidClassifier';
import type { NormalizedEvent } from '../types/events';

// Make Buffer available globally (required by winevtx in browser)
(self as unknown as Record<string, unknown>).Buffer = Buffer;

const BATCH_SIZE = 100;

self.onmessage = async (e: MessageEvent) => {
  const { type, file } = e.data;
  if (type !== 'parse') return;

  try {
    const src = createFileDataSource(file as File);

    // Get total chunk count for progress reporting
    const chunks = await getChunksAsync(src);
    const totalChunks = chunks.length;

    const batch: NormalizedEvent[] = [];
    let recordIndex = 0;
    let lastChunkIndex = -1;

    for await (const record of parseEvtxFileAsync(src)) {
      // Progress: estimate current chunk from record offset
      // ParsedRecord has recordID and timestamp; we track progress by batch
      // Actual structure: record.event.Event.System / record.event.Event.EventData
      const eventWrapper = record.event as {
        Event?: {
          System?: {
            EventID?: { Value?: number };
            TimeCreated?: { SystemTime?: number };
            Computer?: string;
            Level?: number;
            EventRecordID?: number;
          };
          EventData?: Record<string, unknown>;
          UserData?: Record<string, unknown>;
        };
      };

      const ev = eventWrapper?.Event ?? {};
      const sys = ev.System ?? {};

      const eventId = sys.EventID?.Value ?? 0;

      // SystemTime is a Unix timestamp (float seconds)
      const sysTime = sys.TimeCreated?.SystemTime;
      const timestamp = sysTime != null
        ? new Date(sysTime * 1000).toISOString()
        : new Date(Number(record.timestamp) / 10000 - 11644473600000).toISOString();

      const computer = sys.Computer ?? '';
      const level = sys.Level ?? 0;

      const eventData = (ev.EventData ?? ev.UserData ?? {}) as Record<string, unknown>;

      // Prefer TargetUserName (actual logon target) over SubjectUserName (initiating account)
      function buildUser(name: unknown, domain: unknown): string | null {
        const n = String(name ?? '').trim();
        if (!n || n === '-') return null;
        const d = String(domain ?? '').trim();
        return d && d !== '-' ? `${d}\\${n}` : n;
      }
      const user =
        buildUser(eventData['TargetUserName'], eventData['TargetDomainName']) ??
        buildUser(eventData['SubjectUserName'], eventData['SubjectDomainName']) ??
        '';

      // SID-based system user classification
      // Prefer TargetUserSid (the actual target account), fall back to SubjectUserSid
      const targetSid = String(eventData['TargetUserSid'] ?? eventData['SubjectUserSid'] ?? '').trim();
      const isSystemUser = classifyIsSystemUser(targetSid, user);

      // LogonType / IpAddress are only present for logon events (4624, 4625)
      const isLogonEvent = eventId === 4624 || eventId === 4625;
      const logonType = isLogonEvent && eventData['LogonType'] != null
        ? Number(eventData['LogonType'])
        : undefined;
      const ipRaw = isLogonEvent ? String(eventData['IpAddress'] ?? '').trim() : '';
      const ipAddress = ipRaw && ipRaw !== '-' ? ipRaw : undefined;

      const normalizedEvent: NormalizedEvent = {
        id: record.recordID,
        eventId,
        timestamp,
        computer,
        level,
        user,
        description: getEventDescription(eventId),
        logonType,
        ipAddress,
        isSystemUser,
        raw: ev as Record<string, unknown>,
      };

      batch.push(normalizedEvent);
      recordIndex++;

      // Estimate chunk progress (each chunk ~65536 bytes, ~100 records average)
      const estimatedChunk = Math.floor(recordIndex / 100);
      if (estimatedChunk !== lastChunkIndex && totalChunks > 0) {
        lastChunkIndex = estimatedChunk;
        self.postMessage({
          type: 'progress',
          processed: Math.min(estimatedChunk, totalChunks),
          total: totalChunks,
        });
      }

      if (batch.length >= BATCH_SIZE) {
        self.postMessage({ type: 'events', events: [...batch] });
        batch.length = 0;
      }
    }

    // Flush remaining
    if (batch.length > 0) {
      self.postMessage({ type: 'events', events: [...batch] });
    }

    self.postMessage({ type: 'progress', processed: totalChunks, total: totalChunks });
    self.postMessage({ type: 'done' });
  } catch (err) {
    self.postMessage({ type: 'error', message: String(err) });
  }
};
