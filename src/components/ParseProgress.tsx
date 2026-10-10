import { messages, type Lang } from '../utils/i18n';

interface Props {
  processed: number; // bytes read
  total: number;     // file size in bytes
  eventCount: number;
  fileName: string;
  lang: Lang;
}

const toMb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

export function ParseProgress({ processed, total, eventCount, fileName, lang }: Props) {
  const pct = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;

  return (
    <div className="parse-progress">
      <div className="parse-progress__file">{fileName}</div>
      <div
        className="parse-progress__bar-wrap"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="parse-progress__bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="parse-progress__info">
        {messages(lang).parsing(pct, toMb(processed), toMb(total), eventCount)}
      </div>
    </div>
  );
}
