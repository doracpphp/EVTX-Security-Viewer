const pad = (n: number, width = 2) => String(n).padStart(width, '0');

// "YYYY-MM-DD HH:mm:ss" — fixed width so the time column lines up and sorts as text.
export function formatTime(iso: string, utc = false): string {
  const d = new Date(iso);
  if (!iso || isNaN(d.getTime())) return iso;
  const [y, mo, day, h, mi, s] = utc
    ? [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
    : [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
  return `${pad(y, 4)}-${pad(mo)}-${pad(day)} ${pad(h)}:${pad(mi)}:${pad(s)}`;
}

// "UTC" or the browser's current offset, e.g. "UTC+09:00".
export function timeZoneLabel(utc: boolean): string {
  if (utc) return 'UTC';
  const offset = -new Date().getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  return `UTC${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}
