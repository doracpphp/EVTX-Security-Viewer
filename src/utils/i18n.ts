export type Lang = 'ja' | 'en';

const LANG_STORAGE_KEY = 'evtx-lang';

// Initial UI language: a previously chosen language wins; otherwise Japanese
// only when the browser's preferred languages start with "ja", else English.
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'ja' || saved === 'en') return saved;
  } catch {
    // storage unavailable — fall through to browser detection
  }
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    return langs.some(l => l?.toLowerCase().startsWith('ja')) ? 'ja' : 'en';
  } catch {
    return 'en';
  }
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

const MESSAGES = {
  ja: {
    all: 'すべて',
    uncategorized: '未分類',
    count: (n: number) => `${n.toLocaleString()} 件`,
    openAnother: '別のファイルを開く',
    help: '使い方',
    showHelp: '使い方を表示',
    contact: 'お問い合わせ',
    book: '解説書（BOOTH）',
    // upload
    uploadText: 'EVTXファイルをドロップ、またはクリックして選択',
    uploadHint: '.evtx ファイルのみ対応',
    notEvtx: 'EVTXファイルを選択してください。',
    // progress / status
    parsing: (pct: number, readMb: string, totalMb: string, n: number) =>
      `${pct}% (${readMb} / ${totalMb} MB) | ${n.toLocaleString()} 件取得中…`,
    loaded: (name: string, n: number) => `✓ ${name} — ${n.toLocaleString()} 件読み込み完了`,
    skippedChunks: (n: number) => `⚠ 破損した ${n} 個のチャンクをスキップしました`,
    parseError: 'パースエラー',
    retry: 'やり直す',
    workerError: 'EVTXファイルの解析中にエラーが発生しました。',
    // filter bar
    hideSystem: 'システムユーザーを非表示',
    searchPlaceholder: '検索（ユーザー / IP / コンピュータ / イベントデータ）',
    clearSearch: '検索をクリア',
    utc: 'UTC表示',
    exportCsv: 'CSV出力',
    hideChart: '▲ グラフを隠す',
    showChartBtn: '▼ グラフを表示',
    // table
    colTime: '日時',
    colId: 'ID',
    colLevel: 'レベル',
    colComputer: 'コンピュータ',
    colUser: 'ユーザー',
    colLogonType: 'ログオンタイプ',
    colIp: 'IPアドレス',
    colDesc: '説明',
    noEvents: 'このタブには該当イベントがありません。',
    // charts
    byTargetUser: 'ターゲットユーザー別',
    byIp: 'IPアドレス別',
    unknown: '(不明)',
    unknownIp: '(不明/ローカル)',
    other: 'その他',
    // detail
    eventDetail: 'イベント詳細',
    close: '閉じる',
    truncated: '... (表示を省略しました)',
  },
  en: {
    all: 'All',
    uncategorized: 'Uncategorized',
    count: (n: number) => `${n.toLocaleString()} events`,
    openAnother: 'Open another file',
    help: 'Help',
    showHelp: 'Show help',
    contact: 'Contact',
    book: 'Companion Book (BOOTH)',
    uploadText: 'Drop an EVTX file here, or click to choose one',
    uploadHint: 'Only .evtx files are supported',
    notEvtx: 'Please choose an .evtx file.',
    parsing: (pct: number, readMb: string, totalMb: string, n: number) =>
      `${pct}% (${readMb} / ${totalMb} MB) | ${n.toLocaleString()} events loaded…`,
    loaded: (name: string, n: number) => `✓ ${name} — loaded ${n.toLocaleString()} events`,
    skippedChunks: (n: number) => `⚠ Skipped ${n} corrupted chunk(s)`,
    parseError: 'Parse error',
    retry: 'Try again',
    workerError: 'An error occurred while parsing the EVTX file.',
    hideSystem: 'Hide system users',
    searchPlaceholder: 'Search (user / IP / computer / event data)',
    clearSearch: 'Clear search',
    utc: 'Show UTC',
    exportCsv: 'Export CSV',
    hideChart: '▲ Hide charts',
    showChartBtn: '▼ Show charts',
    colTime: 'Time',
    colId: 'ID',
    colLevel: 'Level',
    colComputer: 'Computer',
    colUser: 'User',
    colLogonType: 'Logon Type',
    colIp: 'IP Address',
    colDesc: 'Description',
    noEvents: 'No events match this selection.',
    byTargetUser: 'By target user',
    byIp: 'By IP address',
    unknown: '(unknown)',
    unknownIp: '(unknown/local)',
    other: 'Other',
    eventDetail: 'Event Detail',
    close: 'Close',
    truncated: '... (truncated)',
  },
} satisfies Record<Lang, Record<string, unknown>>;

export type Messages = typeof MESSAGES.ja;

export function messages(lang: Lang): Messages {
  return MESSAGES[lang];
}
