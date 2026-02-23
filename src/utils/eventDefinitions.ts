import type { TabDefinition } from '../types/events';

export const TABS: TabDefinition[] = [
  { id: 'all',   label: 'すべて',       description: '全イベント' },
  { id: '4624',  label: 'ログオン成功',  eventId: 4624, description: 'An account was successfully logged on' },
  { id: '4625',  label: 'ログオン失敗',  eventId: 4625, description: 'An account failed to log on' },
  { id: '4634',  label: 'ログオフ',      eventId: 4634, description: 'An account was logged off' },
  { id: '4648',  label: '明示的ログオン', eventId: 4648, description: 'A logon was attempted using explicit credentials' },
  { id: '4672',  label: '特権割り当て',  eventId: 4672, description: 'Special privileges assigned to new logon' },
  { id: '4688',  label: 'プロセス作成',  eventId: 4688, description: 'A new process has been created' },
  { id: '4698',  label: 'タスク作成',    eventId: 4698, description: 'A scheduled task was created' },
  { id: '4720',  label: 'アカウント作成', eventId: 4720, description: 'A user account was created' },
  { id: '4724',  label: 'パスワードリセット', eventId: 4724, description: "An attempt was made to reset an account's password" },
  { id: '4740',  label: 'アカウントロック', eventId: 4740, description: 'A user account was locked out' },
  { id: '4776',  label: '資格情報検証',  eventId: 4776, description: 'The computer attempted to validate credentials' },
  { id: '7045',  label: 'サービス追加',  eventId: 7045, description: 'A new service was installed in the system' },
  { id: 'other', label: 'その他',        description: '上記以外のイベント' },
];

const KNOWN_EVENT_IDS = new Set([4624, 4625, 4634, 4648, 4672, 4688, 4698, 4720, 4724, 4740, 4776, 7045]);

export function getEventDescription(eventId: number): string {
  const tab = TABS.find(t => t.eventId === eventId);
  return tab?.description ?? `Event ID ${eventId}`;
}

export function isKnownEventId(eventId: number): boolean {
  return KNOWN_EVENT_IDS.has(eventId);
}

const LOGON_TYPES: Record<number, string> = {
  2:  '2: 対話型',
  3:  '3: ネットワーク',
  4:  '4: バッチ',
  5:  '5: サービス',
  7:  '7: ロック解除',
  8:  '8: ネットワーク平文',
  9:  '9: 新規資格情報',
  10: '10: リモート対話型 (RDP)',
  11: '11: キャッシュ対話型',
  12: '12: キャッシュリモート',
  13: '13: キャッシュロック解除',
};

export function getLogonTypeLabel(logonType: number): string {
  return LOGON_TYPES[logonType] ?? `${logonType}: 不明`;
}

export function getLevelLabel(level: number): string {
  switch (level) {
    case 0: return '情報';
    case 1: return '重大';
    case 2: return 'エラー';
    case 3: return '警告';
    case 4: return '情報';
    case 5: return '詳細';
    default: return `Lv${level}`;
  }
}
