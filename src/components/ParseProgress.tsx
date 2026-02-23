interface Props {
  processed: number;
  total: number;
  eventCount: number;
  fileName: string;
}

export function ParseProgress({ processed, total, eventCount, fileName }: Props) {
  const pct = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;

  return (
    <div className="parse-progress">
      <div className="parse-progress__file">{fileName}</div>
      <div className="parse-progress__bar-wrap">
        <div className="parse-progress__bar" style={{ width: `${pct}%` }} />
      </div>
      <div className="parse-progress__info">
        チャンク {processed} / {total} &nbsp;|&nbsp; {eventCount.toLocaleString()} 件取得中…
      </div>
    </div>
  );
}
