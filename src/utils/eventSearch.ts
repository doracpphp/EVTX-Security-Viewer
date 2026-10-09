import { getEventDesc } from './securityCategories';
import type { Lang } from './i18n';
import type { NormalizedEvent } from '../types/events';

function valueMatches(v: unknown, q: string, depth = 0): boolean {
  if (v == null) return false;
  if (typeof v === 'object') {
    // EventData is flat; UserData nests one level (e.g. { LogFileCleared: {...} })
    return depth < 2 && Object.values(v as Record<string, unknown>).some(x => valueMatches(x, q, depth + 1));
  }
  return String(v).toLowerCase().includes(q);
}

/**
 * Case-insensitive substring match over the table columns and every
 * EventData / UserData value (process names, command lines, share names, …).
 * `query` must already be lower-cased and trimmed.
 */
export function matchesSearch(ev: NormalizedEvent, query: string, lang: Lang): boolean {
  if (String(ev.eventId) === query) return true;
  for (const s of [ev.user, ev.computer, ev.ipAddress, getEventDesc(ev.eventId, lang) ?? ev.description]) {
    if (s && s.toLowerCase().includes(query)) return true;
  }
  return valueMatches(ev.raw['EventData'] ?? ev.raw['UserData'], query);
}
