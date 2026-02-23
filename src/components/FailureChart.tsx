import { useMemo } from 'react';
import { PieChartCard, buildEntries } from './PieChartCard';
import type { NormalizedEvent } from '../types/events';

interface Props {
  events: NormalizedEvent[]; // already filtered to 4625
}

export function FailureChart({ events }: Props) {
  const total = events.length;

  const userEntries = useMemo(
    () => buildEntries(events.map(ev => ev.user)),
    [events],
  );

  const ipEntries = useMemo(
    () => buildEntries(events.map(ev => ev.ipAddress ?? ''), '(不明/ローカル)'),
    [events],
  );

  if (total === 0) return null;

  return (
    <div className="failure-charts">
      <PieChartCard
        title="ターゲットユーザー別"
        total={total}
        entries={userEntries}
      />
      <PieChartCard
        title="IPアドレス別"
        total={total}
        entries={ipEntries}
      />
    </div>
  );
}
