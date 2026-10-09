import { getLevelLabel, getLogonTypeLabel } from './eventDefinitions';
import { getEventDesc } from './securityCategories';
import { formatTime, timeZoneLabel } from './formatTime';
import type { Lang } from './i18n';
import type { NormalizedEvent } from '../types/events';

// Values come from the log (e.g. attacker-chosen user names in 4625), so neutralise
// spreadsheet formulas (CSV injection) and quote every cell.
function cell(value: unknown): string {
  let s = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

function eventDataJson(ev: NormalizedEvent): string {
  const data = ev.raw['EventData'] ?? ev.raw['UserData'];
  return data ? JSON.stringify(data) : '';
}

export function buildCsv(events: NormalizedEvent[], lang: Lang, utc: boolean): string {
  const header = [
    `Time (${timeZoneLabel(utc)})`, 'RecordID', 'EventID', 'Level', 'Computer', 'User',
    'LogonType', 'IpAddress', 'Description', 'EventData',
  ];
  const lines = [header.map(cell).join(',')];
  for (const ev of events) {
    lines.push([
      formatTime(ev.timestamp, utc),
      ev.id,
      ev.eventId,
      getLevelLabel(ev.level, lang),
      ev.computer,
      ev.user,
      ev.logonType != null ? getLogonTypeLabel(ev.logonType, lang) : '',
      ev.ipAddress ?? '',
      getEventDesc(ev.eventId, lang) ?? ev.description,
      eventDataJson(ev),
    ].map(cell).join(','));
  }
  return lines.join('\r\n');
}

export function downloadCsv(csv: string, fileName: string): void {
  // BOM so Excel opens UTF-8 (Japanese) text correctly
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
