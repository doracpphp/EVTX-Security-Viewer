import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getLevelLabel, getLogonTypeLabel } from '../utils/eventDefinitions';
import type { NormalizedEvent } from '../types/events';

const ROW_HEIGHT = 36;

interface Props {
  events: NormalizedEvent[];
  onRowClick: (event: NormalizedEvent) => void;
  showLogonCols?: boolean;
}

export function EventTable({ events, onRowClick, showLogonCols = false }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  });

  function formatTime(iso: string): string {
    try {
      const d = new Date(iso);
      return d.toLocaleString('ja-JP', { hour12: false });
    } catch {
      return iso;
    }
  }

  if (events.length === 0) {
    return (
      <div className="table-empty">このタブには該当イベントがありません。</div>
    );
  }

  return (
    <div className="table-wrap">
      <div className="table-header">
        <div className="col col-time">日時</div>
        <div className="col col-id">ID</div>
        <div className="col col-level">レベル</div>
        <div className="col col-computer">コンピュータ</div>
        <div className="col col-user">ユーザー</div>
        {showLogonCols && <div className="col col-logontype">ログオンタイプ</div>}
        {showLogonCols && <div className="col col-ip">IPアドレス</div>}
        <div className="col col-desc">説明</div>
      </div>

      <div ref={parentRef} className="table-scroll">
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map(vrow => {
            const ev = events[vrow.index];
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
                <div className="col col-time">{formatTime(ev.timestamp)}</div>
                <div className="col col-id">{ev.eventId}</div>
                <div className="col col-level">
                  <span className={`level level-${ev.level}`}>{getLevelLabel(ev.level)}</span>
                </div>
                <div className="col col-computer" title={ev.computer}>{ev.computer}</div>
                <div className="col col-user" title={ev.user}>{ev.user}</div>
                {showLogonCols && (
                  <div className="col col-logontype">
                    {ev.logonType != null ? getLogonTypeLabel(ev.logonType) : ''}
                  </div>
                )}
                {showLogonCols && (
                  <div className="col col-ip">{ev.ipAddress ?? ''}</div>
                )}
                <div className="col col-desc" title={ev.description}>{ev.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="table-footer">
        {events.length.toLocaleString()} 件
      </div>
    </div>
  );
}
