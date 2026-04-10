export function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ja-JP', { hour12: false });
  } catch {
    return iso;
  }
}
