import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getLevelLabel, getLogonTypeLabel } from '../utils/eventDefinitions';
import { getEventDesc } from '../utils/securityCategories';
import { formatTime, timeZoneLabel } from '../utils/formatTime';
import { messages, type Lang } from '../utils/i18n';
import type { NormalizedEvent } from '../types/events';

const ROW_HEIGHT = 36;

interface Props {
  events: NormalizedEvent[];
  onRowClick: (event: NormalizedEvent) => void;
  showLogonCols?: boolean;
  lang: Lang;
  utc: boolean;
}

export function EventTable({ events, onRowClick, showLogonCols = false, lang, utc }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const t = messages(lang);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  });

  if (events.length === 0) {
    return (
      <div className="table-empty">{t.noEvents}</div>
    );
  }

  return (
    <div className="table-wrap">
      <div className="table-header">
        <div className="col col-time">{t.colTime} ({timeZoneLabel(utc)})</div>
        <div className="col col-id">{t.colId}</div>
        <div className="col col-level">{t.colLevel}</div>
        <div className="col col-computer">{t.colComputer}</div>
        <div className="col col-user">{t.colUser}</div>
        {showLogonCols && <div className="col col-logontype">{t.colLogonType}</div>}
        {showLogonCols && <div className="col col-ip">{t.colIp}</div>}
        <div className="col col-desc">{t.colDesc}</div>
      </div>

      <div ref={parentRef} className="table-scroll">
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map(vrow => {
            const ev = events[vrow.index];
            const desc = getEventDesc(ev.eventId, lang) ?? ev.description;
            return (
              <div
                key={vrow.key}
                className="table-row"
                style={{
                  position: 'absolute',
                  top: 0,
                  transform: `translateY(${vrow.start}px)`,
                  height: `${ROW_HEIGHT}px`,
                }}
                onClick={() => onRowClick(ev)}
              >
                <div className="col col-time">{formatTime(ev.timestamp, utc)}</div>
                <div className="col col-id">{ev.eventId}</div>
                <div className="col col-level">
                  <span className={`level level-${ev.level}`}>{getLevelLabel(ev.level, lang)}</span>
                </div>
                <div className="col col-computer" title={ev.computer}>{ev.computer}</div>
                <div className="col col-user" title={ev.user}>{ev.user}</div>
                {showLogonCols && (
                  <div className="col col-logontype">
                    {ev.logonType != null ? getLogonTypeLabel(ev.logonType, lang) : ''}
                  </div>
                )}
                {showLogonCols && (
                  <div className="col col-ip">{ev.ipAddress ?? ''}</div>
                )}
                <div className="col col-desc" title={desc}>{desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="table-footer">
        {t.count(events.length)}
      </div>
    </div>
  );
}
