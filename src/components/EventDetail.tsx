import { useEffect } from 'react';
import { getLevelLabel, getLogonTypeLabel, getFailureReasonLabel, getStatusCodeLabel, getKerberosStatusLabel } from '../utils/eventDefinitions';
import type { NormalizedEvent } from '../types/events';

interface Props {
  event: NormalizedEvent;
  onClose: () => void;
  lang: 'ja' | 'en';
}

export function EventDetail({ event, onClose, lang }: Props) {
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

  // Flatten one level: if a value is a nested object, expand its entries directly
  function flattenRows(data: Record<string, unknown>): Array<[string, string]> {
    const rows: Array<[string, string]> = [];
    for (const [k, v] of Object.entries(data)) {
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        const nested = Object.entries(v as Record<string, unknown>);
        if (nested.length === 0) {
          rows.push([k, '—']);
        } else {
          for (const [nk, nv] of nested) {
            rows.push([nk, String(nv ?? '—')]);
          }
        }
      } else {
        let display: string;
        if (k === 'LogonType') {
          display = getLogonTypeLabel(Number(v), lang);
        } else if (k === 'FailureReason') {
          display = getFailureReasonLabel(String(v ?? ''), lang);
        } else if (k === 'Status' || k === 'SubStatus') {
          display = event.eventId === 4771
            ? getKerberosStatusLabel(String(v ?? ''), lang)
            : getStatusCodeLabel(String(v ?? ''), lang);
        } else {
          display = String(v ?? '—');
        }
        rows.push([k, display]);
      }
    }
    return rows;
  }
  const eventRows = flattenRows(eventData);

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
          <div className="detail-columns">
            <section className="detail-section">
              <h3>{lang === 'ja' ? 'システム情報' : 'System Info'}</h3>
              <table className="detail-table">
                <tbody>
                  <tr><td>{lang === 'ja' ? '日時' : 'Time'}</td><td>{formatTime(event.timestamp)}</td></tr>
                  <tr><td>{lang === 'ja' ? 'イベントID' : 'Event ID'}</td><td>{event.eventId}</td></tr>
                  <tr><td>{lang === 'ja' ? 'レベル' : 'Level'}</td><td><span className={`level level-${event.level}`}>{getLevelLabel(event.level)}</span></td></tr>
                  <tr><td>{lang === 'ja' ? 'コンピュータ' : 'Computer'}</td><td>{event.computer}</td></tr>
                  <tr><td>{lang === 'ja' ? 'ユーザー' : 'User'}</td><td>{event.user || '—'}</td></tr>
                  <tr><td>{lang === 'ja' ? '説明' : 'Description'}</td><td>{event.description}</td></tr>
                </tbody>
              </table>
            </section>

            {eventRows.length > 0 && (
              <section className="detail-section">
                <h3>{lang === 'ja' ? 'イベントデータ' : 'Event Data'}</h3>
                <table className="detail-table">
                  <tbody>
                    {eventRows.map(([k, v], i) => (
                      <tr key={i}>
                        <td>{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>

          <section className="detail-section">
            <h3>RAW JSON</h3>
            <pre className="detail-json">{JSON.stringify(raw, null, 2)}</pre>
          </section>
        </div>
      </div>
    </div>
  );
}
