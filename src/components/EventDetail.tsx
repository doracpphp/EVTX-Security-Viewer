import { useEffect } from 'react';
import { getLevelLabel, getLogonTypeLabel, getFailureReasonLabel, getStatusCodeLabel, getKerberosStatusLabel, getEventInfo, resolveWindowsMsgIds } from '../utils/eventDefinitions';
import { getEventDesc } from '../utils/securityCategories';
import { formatTime, timeZoneLabel } from '../utils/formatTime';
import { messages, type Lang } from '../utils/i18n';
import type { NormalizedEvent } from '../types/events';

interface Props {
  event: NormalizedEvent;
  onClose: () => void;
  lang: Lang;
  utc: boolean;
}

export function EventDetail({ event, onClose, lang, utc }: Props) {
  const t = messages(lang);

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Flatten event data for display
  const raw = event.raw as Record<string, unknown>;
  const eventData = (raw['EventData'] ?? raw['UserData'] ?? {}) as Record<string, unknown>;

  function formatValue(k: string, v: unknown): string {
    if (v == null) return '—';
    if (typeof v === 'object') return JSON.stringify(v);
    if (k === 'LogonType') return getLogonTypeLabel(Number(v), lang);
    if (k === 'FailureReason') return getFailureReasonLabel(String(v), lang);
    if (k === 'Status' || k === 'SubStatus') {
      return event.eventId === 4771
        ? getKerberosStatusLabel(String(v), lang)
        : getStatusCodeLabel(String(v), lang);
    }
    return resolveWindowsMsgIds(String(v));
  }

  // Flatten one level: if a value is a nested object (e.g. UserData), expand its entries directly
  function flattenRows(data: Record<string, unknown>): Array<[string, string]> {
    const rows: Array<[string, string]> = [];
    for (const [k, v] of Object.entries(data)) {
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        const nested = Object.entries(v as Record<string, unknown>);
        if (nested.length === 0) {
          rows.push([k, '—']);
        } else {
          for (const [nk, nv] of nested) {
            rows.push([nk, formatValue(nk, nv)]);
          }
        }
      } else {
        rows.push([k, formatValue(k, v)]);
      }
    }
    return rows;
  }
  const eventRows = flattenRows(eventData);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title" id="event-detail-title">
            {t.eventDetail} &nbsp;
            <span className="modal-event-id">ID: {event.eventId}</span>
          </h2>
          <button className="modal-close" onClick={onClose} aria-label={t.close} autoFocus>✕</button>
        </div>

        <div className="modal-body">
          <div className="detail-columns">
            <section className="detail-section">
              <h3>{lang === 'ja' ? 'システム情報' : 'System Info'}</h3>
              <table className="detail-table">
                <tbody>
                  <tr><td>{t.colTime}</td><td>{formatTime(event.timestamp, utc)} ({timeZoneLabel(utc)})</td></tr>
                  <tr><td>{lang === 'ja' ? 'レコードID' : 'Record ID'}</td><td>{event.id}</td></tr>
                  <tr><td>{lang === 'ja' ? 'イベントID' : 'Event ID'}</td><td>{event.eventId}</td></tr>
                  <tr><td>{lang === 'ja' ? 'レベル' : 'Level'}</td><td><span className={`level level-${event.level}`}>{getLevelLabel(event.level, lang)}</span></td></tr>
                  <tr><td>{lang === 'ja' ? 'コンピュータ' : 'Computer'}</td><td>{event.computer}</td></tr>
                  <tr><td>{lang === 'ja' ? 'ユーザー' : 'User'}</td><td>{event.user || '—'}</td></tr>
                  <tr><td>{lang === 'ja' ? '説明' : 'Description'}</td><td>{getEventDesc(event.eventId, lang) ?? event.description}</td></tr>
                </tbody>
              </table>
            </section>

            {eventRows.length > 0 ? (
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
            ) : getEventInfo(event.eventId, lang) ? (
              <section className="detail-section">
                <h3>{lang === 'ja' ? 'イベントデータ' : 'Event Data'}</h3>
                <p className="detail-no-data">{getEventInfo(event.eventId, lang)}</p>
              </section>
            ) : null}
          </div>

          <section className="detail-section">
            <h3>RAW JSON</h3>
            <pre className="detail-json">{(() => {
              const json = JSON.stringify(raw, null, 2);
              const MAX = 500_000;
              return json.length > MAX ? json.slice(0, MAX) + '\n\n' + t.truncated : json;
            })()}</pre>
          </section>
        </div>
      </div>
    </div>
  );
}
