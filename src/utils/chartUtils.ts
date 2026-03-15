const MAX_SLICES = 10;

export interface ChartEntry {
  name: string;
  value: number;
}

export function buildEntries(
  values: string[],
  fallback = '(不明)',
): ChartEntry[] {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = v || fallback;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length <= MAX_SLICES) {
    return sorted.map(([name, value]) => ({ name, value }));
  }
  const top = sorted.slice(0, MAX_SLICES - 1);
  const otherTotal = sorted.slice(MAX_SLICES - 1).reduce((s, [, v]) => s + v, 0);
  return [
    ...top.map(([name, value]) => ({ name, value })),
    { name: 'その他', value: otherTotal },
  ];
}
