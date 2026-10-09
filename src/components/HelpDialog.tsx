import { useEffect } from 'react';

type Lang = 'ja' | 'en';

interface HelpDialogProps {
  lang: Lang;
  onClose: () => void;
}

const TEXT = {
  ja: {
    title: 'EVTX Security Viewer の使い方',
    intro: 'Windows セキュリティイベントログ（.evtx）をブラウザ上で解析・可視化するツールです。ファイルはサーバーに送信されず、すべてローカルで処理されます。',
    steps: [
      {
        h: '1. ファイルを開く',
        d: '中央のエリアに .evtx ファイルをドラッグ&ドロップするか、クリックして選択します。対象は通常 C:\\Windows\\System32\\winevt\\Logs\\Security.evtx です。',
      },
      {
        h: '2. 解析中もリアルタイム表示',
        d: '大きなファイルでもイベントは順次ストリーミング表示されます。解析中でもフィルタリングや確認が可能です。',
      },
      {
        h: '3. カテゴリ・イベントIDで絞り込み',
        d: 'ナビゲーションでカテゴリ → サブカテゴリ → イベントID と階層的に絞り込めます（ログオン/ログオフ・プロセス追跡・アカウント管理など）。',
      },
      {
        h: '4. イベント詳細を確認',
        d: 'テーブルの行をクリックするとモーダルでシステム情報・イベントデータ・RAW JSON が表示されます。LogonType / FailureReason などは自動的に人間が読める文字列に変換されます。',
      },
      {
        h: '5. システムユーザーを除外',
        d: 'チェックボックスで SYSTEM / LOCAL SERVICE / NETWORK SERVICE 等のビルトインアカウントを非表示にできます。',
      },
      {
        h: '6. ログオン失敗グラフ',
        d: 'イベントID 4625（ログオン失敗）を選択すると、失敗ユーザー別・IP別の円グラフが表示されます。ブルートフォース調査に有用です。',
      },
      {
        h: '7. 言語切替・別ファイル',
        d: '右上の EN / 日本語ボタンで表示言語を切替、「別のファイルを開く」で状態をリセットできます。',
      },
    ],
    bookTitle: '📘 解説書のご案内',
    bookName: 'Windowsイベントログ大全集【前編】',
    bookDesc: '本ツールは、Windows セキュリティ監査ログのイベントID・発生条件・再現方法を体系的に解説した同人誌の補助ツールとして開発されました。システム / ログオン・ログオフ / オブジェクトアクセス / 特権使用 / 詳細追跡 などのカテゴリを詳細に解説しています。',
    bookCta: 'BOOTH で書籍を見る →',
    close: '閉じてはじめる',
    dontShow: '次回から表示しない',
  },
  en: {
    title: 'How to use EVTX Security Viewer',
    intro: 'A browser-based viewer for Windows Security Event Logs (.evtx). Files are never uploaded — everything is processed locally.',
    steps: [
      {
        h: '1. Open a file',
        d: 'Drag & drop an .evtx file onto the center area, or click to choose one. Typical source: C:\\Windows\\System32\\winevt\\Logs\\Security.evtx.',
      },
      {
        h: '2. Streamed parsing',
        d: 'Even large files stream events into the table as they are parsed. You can filter and inspect while parsing continues.',
      },
      {
        h: '3. Filter by category & event ID',
        d: 'Navigate hierarchically: category → subcategory → event ID (Logon/Logoff, Process Tracking, Account Management, etc.).',
      },
      {
        h: '4. Inspect event details',
        d: 'Click any row to open a modal showing system info, event data, and raw JSON. LogonType / FailureReason / Status are automatically translated to human-readable strings.',
      },
      {
        h: '5. Hide system users',
        d: 'Toggle the checkbox to exclude built-in accounts such as SYSTEM, LOCAL SERVICE, and NETWORK SERVICE.',
      },
      {
        h: '6. Logon failure chart',
        d: 'Selecting event ID 4625 (logon failure) shows pie charts by target user and source IP — useful for brute-force investigations.',
      },
      {
        h: '7. Language & file switch',
        d: 'Use EN / 日本語 in the header to switch languages. "Open another file" resets state for a new file.',
      },
    ],
    bookTitle: '📘 Companion book',
    bookName: 'Windows Event Log Encyclopedia — Part 1 (JP)',
    bookDesc: 'This tool was built as a companion to a Japanese-language doujin technical book that documents Windows Security audit event IDs, their trigger conditions, and reproduction steps across System, Logon/Logoff, Object Access, Privilege Use, and Detailed Tracking categories.',
    bookCta: 'View the book on BOOTH →',
    close: 'Close and start',
    dontShow: "Don't show again",
  },
} as const;

export function HelpDialog({ lang, onClose }: HelpDialogProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const t = TEXT[lang];

  const dismissForever = () => {
    try {
      localStorage.setItem('evtx-help-seen', '1');
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal help-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{t.title}</div>
          <button className="modal-close" onClick={onClose} aria-label="close">✕</button>
        </div>
        <div className="modal-body">
          <p className="help-intro">{t.intro}</p>
          <ol className="help-steps">
            {t.steps.map((s, i) => (
              <li key={s.h}>
                <div className="help-step__text">
                  <strong>{s.h}</strong>
                  <span>{s.d}</span>
                </div>
                <img
                  className="help-step__img"
                  src={`/help/step${i + 1}.jpg`}
                  alt={s.h}
                  loading="lazy"
                  width="900"
                  height="563"
                />
              </li>
            ))}
          </ol>
          <div className="help-book">
            <div className="help-book__head">{t.bookTitle}</div>
            <div className="help-book__title">{t.bookName}</div>
            <div className="help-book__desc">{t.bookDesc}</div>
            <a
              className="help-book__cta"
              href="https://frees.booth.pm/items/8191447"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.bookCta}
            </a>
          </div>
        </div>
        <div className="help-footer">
          <button className="btn-help-dismiss" onClick={dismissForever}>{t.dontShow}</button>
          <button className="btn-help-close" onClick={onClose}>{t.close}</button>
        </div>
      </div>
    </div>
  );
}
