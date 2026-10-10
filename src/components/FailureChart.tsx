import { useMemo } from 'react';
import { PieChartCard } from './PieChartCard';
import { buildEntries } from '../utils/chartUtils';
import { messages, type Lang } from '../utils/i18n';
import type { NormalizedEvent } from '../types/events';

interface Props {
  events: NormalizedEvent[]; // already filtered to 4625
  lang: Lang;
}

export function FailureChart({ events, lang }: Props) {
  const total = events.length;
  const t = messages(lang);

  const userEntries = useMemo(
    () => buildEntries(events.map(ev => ev.user), t.unknown, t.other),
    [events, t],
  );

  const ipEntries = useMemo(
    () => buildEntries(events.map(ev => ev.ipAddress ?? ''), t.unknownIp, t.other),
    [events, t],
  );

  if (total === 0) return null;

  return (
    <div className="failure-charts">
      <PieChartCard
        title={t.byTargetUser}
        total={total}
        entries={userEntries}
        lang={lang}
      />
      <PieChartCard
        title={t.byIp}
        total={total}
        entries={ipEntries}
        lang={lang}
      />
    </div>
  );
}
