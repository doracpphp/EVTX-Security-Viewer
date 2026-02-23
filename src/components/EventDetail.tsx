import { useEffect } from 'react';
import { getLevelLabel } from '../utils/eventDefinitions';
import type { NormalizedEvent } from '../types/events';

interface Props {
  event: NormalizedEvent;
  onClose: () => void;
}

export function EventDetail({ event, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function formatTime(iso: string): string {
    try {
      return new Date(iso).toLocaleString('ja-JP', { hour12: false });
    } catch {
      return iso;
    }
  }

  // Flatten event data for display
  const raw = event.raw as Record<string, unknown>;
  const eventData = (raw['EventData'] ?? raw['UserData'] ?? {}) as Record<string, unknown>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            イベント詳細 &nbsp;
            <span className="modal-event-id">ID: {event.eventId}</span>
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <section className="detail-section">
            <h3>システム情報</h3>
            <table className="detail-table">
              <tbody>
                <tr><td>日時</td><td>{formatTime(event.timestamp)}</td></tr>
                <tr><td>イベントID</td><td>{event.eventId}</td></tr>
                <tr><td>レベル</td><td><span className={`level level-${event.level}`}>{getLevelLabel(event.level)}</span></td></tr>
                <tr><td>コンピュータ</td><td>{event.computer}</td></tr>
                <tr><td>ユーザー</td><td>{event.user || '—'}</td></tr>
                <tr><td>説明</td><td>{event.description}</td></tr>
              </tbody>
            </table>
          </section>

          {Object.keys(eventData).length > 0 && (
            <section className="detail-section">
              <h3>イベントデータ</h3>
              <table className="detail-table">
                <tbody>
                  {Object.entries(eventData).map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{String(v ?? '—')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section className="detail-section">
            <h3>RAW JSON</h3>
            <pre className="detail-json">{JSON.stringify(raw, null, 2)}</pre>
          </section>
        </div>
      </div>
    </div>
  );
}
