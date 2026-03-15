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

const LOGON_TYPES_JA: Record<number, string> = {
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

const LOGON_TYPES_EN: Record<number, string> = {
  2:  '2: Interactive',
  3:  '3: Network',
  4:  '4: Batch',
  5:  '5: Service',
  7:  '7: Unlock',
  8:  '8: NetworkCleartext',
  9:  '9: NewCredentials',
  10: '10: RemoteInteractive (RDP)',
  11: '11: CachedInteractive',
  12: '12: CachedRemoteInteractive',
  13: '13: CachedUnlock',
};

export function getLogonTypeLabel(logonType: number, lang: 'ja' | 'en' = 'en'): string {
  const map = lang === 'ja' ? LOGON_TYPES_JA : LOGON_TYPES_EN;
  return map[logonType] ?? `${logonType}: ${lang === 'ja' ? '不明' : 'Unknown'}`;
}

// %%XXXX failure reason codes used in FailureReason field
const FAILURE_REASON_CODES_EN: Record<string, string> = {
  '%%2304': 'An error occurred during logon',
  '%%2305': 'The specified user account has expired',
  '%%2309': "The specified account's password has expired",
  '%%2310': 'Account currently disabled',
  '%%2311': 'Account logon time restriction violation',
  '%%2312': 'User not allowed to logon at this computer',
  '%%2313': 'Unknown user name or bad password',
  '%%2314': 'Account currently locked out',
};

const FAILURE_REASON_CODES_JA: Record<string, string> = {
  '%%2304': 'ログオン中にエラーが発生しました',
  '%%2305': '指定されたユーザーアカウントの有効期限が切れています',
  '%%2309': '指定されたアカウントのパスワードの有効期限が切れています',
  '%%2310': 'アカウントは現在無効です',
  '%%2311': 'アカウントのログオン時刻制限違反',
  '%%2312': 'このコンピューターへのログオンが許可されていません',
  '%%2313': '不明なユーザー名またはパスワードが正しくありません',
  '%%2314': 'アカウントは現在ロックアウトされています',
};

export function getFailureReasonLabel(value: string, lang: 'ja' | 'en' = 'en'): string {
  const map = lang === 'ja' ? FAILURE_REASON_CODES_JA : FAILURE_REASON_CODES_EN;
  return map[value] ?? value;
}

// NTSTATUS hex codes used in Status / SubStatus fields
const STATUS_CODES_EN: Record<string, string> = {
  '0x0':        'Successful',
  '0xc000006d': 'Logon failure: invalid username or authentication information',
  '0xc0000064': 'User name does not exist',
  '0xc000006a': 'User name is correct but the password is wrong',
  '0xc000006e': 'User account restriction — check SubStatus for detail',
  '0xc0000234': 'User is currently locked out',
  '0xc0000072': 'Account is currently disabled',
  '0xc000006f': 'User tried to logon outside allowed day/time restrictions',
  '0xc0000070': 'Workstation restriction or Authentication Policy Silo violation',
  '0xc0000193': 'Account expiration',
  '0xc0000071': 'Expired password',
  '0xc0000133': 'Clocks between DC and other computer too far out of sync',
  '0xc0000224': 'User is required to change password at next logon',
  '0xc0000225': 'Windows bug — not a security risk',
  '0xc000015b': 'User has not been granted the requested logon type at this machine',
  '0xc000005e': 'No logon servers available to service the logon request',
  '0xc0000371': 'The local account store does not contain secret material for the specified account',
  '0xc00002ee': 'An error occurred during logon',
  '0xc0000413': 'Authentication firewall prohibits logon',
};

const STATUS_CODES_JA: Record<string, string> = {
  '0x0':        '成功',
  '0xc000006d': 'ログオン失敗: 無効なユーザー名または認証情報',
  '0xc0000064': 'ユーザー名が存在しません',
  '0xc000006a': 'ユーザー名は正しいがパスワードが間違っています',
  '0xc000006e': 'ユーザーアカウントの制限 — SubStatusで詳細を確認してください',
  '0xc0000234': 'ユーザーは現在ロックアウトされています',
  '0xc0000072': 'アカウントは現在無効です',
  '0xc000006f': '許可された曜日または時間外にログオンしようとしました',
  '0xc0000070': 'ワークステーション制限または認証ポリシーサイロ違反',
  '0xc0000193': 'アカウントの有効期限切れ',
  '0xc0000071': 'パスワードの有効期限切れ',
  '0xc0000133': 'DCと他のコンピューターの時刻の差が大きすぎます',
  '0xc0000224': '次回ログオン時にパスワードの変更が必要です',
  '0xc0000225': 'Windowsのバグ — セキュリティリスクではありません',
  '0xc000015b': 'このマシンで要求されたログオンタイプが許可されていません',
  '0xc000005e': 'ログオン要求を処理できるログオンサーバーがありません',
  '0xc0000371': '指定されたアカウントのシークレット情報がローカルアカウントストアに含まれていません',
  '0xc00002ee': 'ログオン中にエラーが発生しました',
  '0xc0000413': '認証ファイアウォールがログオンを禁止しています',
};

export function getStatusCodeLabel(value: string, lang: 'ja' | 'en' = 'en'): string {
  // Normalize to lowercase hex string (e.g. "3221225572" → "0xc0000064")
  let key = value.toLowerCase();
  if (!key.startsWith('0x')) {
    const n = parseInt(value, 10);
    if (!isNaN(n)) key = '0x' + (n >>> 0).toString(16).padStart(8, '0');
  }
  const map = lang === 'ja' ? STATUS_CODES_JA : STATUS_CODES_EN;
  const label = map[key];
  return label ? `${key} — ${label}` : value;
}

// Kerberos error codes used in Status field of event 4771
const KERBEROS_STATUS_CODES_EN: Record<string, string> = {
  '0x1':  "Client's entry in database has expired",
  '0x2':  "Server's entry in database has expired",
  '0x3':  'Requested protocol version # not supported',
  '0x4':  "Client's key encrypted in old master key",
  '0x5':  "Server's key encrypted in old master key",
  '0x6':  'Client not found in Kerberos database (bad username or account not replicated to DC yet)',
  '0x7':  'Server not found in Kerberos database (new computer account not replicated yet or pre-W2K)',
  '0x8':  'Multiple principal entries in database',
  '0x9':  'The client or server has a null key (reset the password on the account)',
  '0xa':  'Ticket not eligible for postdating',
  '0xb':  'Requested start time is later than end time',
  '0xc':  'KDC policy rejects request (workstation restriction)',
  '0xd':  'KDC cannot accommodate requested option',
  '0xe':  'KDC has no support for encryption type',
  '0xf':  'KDC has no support for checksum type',
  '0x10': 'KDC has no support for padata type',
  '0x11': 'KDC has no support for transited type',
  '0x12': 'Clients credentials have been revoked (account disabled, expired, locked out, or logon hours restriction)',
  '0x13': 'Credentials for server have been revoked',
  '0x14': 'TGT has been revoked',
  '0x15': 'Client not yet valid — try again later',
  '0x16': 'Server not yet valid — try again later',
  '0x17': 'Password has expired',
  '0x18': 'Pre-authentication information was invalid (usually means bad password)',
  '0x19': 'Additional pre-authentication required',
  '0x1f': 'Integrity check on decrypted field failed',
  '0x20': 'Ticket expired (frequently logged by computer accounts)',
  '0x21': 'Ticket not yet valid',
  '0x22': 'Request is a replay',
  '0x23': "The ticket isn't for us",
  '0x24': "Ticket and authenticator don't match",
  '0x25': "Clock skew too great (workstation's clock too far out of sync with DC)",
  '0x26': 'Incorrect net address (IP address change?)',
  '0x27': 'Protocol version mismatch',
  '0x28': 'Invalid msg type',
  '0x29': 'Message stream modified',
  '0x2a': 'Message out of order',
  '0x2c': 'Specified version of key is not available',
  '0x2d': 'Service key not available',
  '0x2e': 'Mutual authentication failed (may be a memory allocation failure)',
  '0x2f': 'Incorrect message direction',
  '0x30': 'Alternative authentication method required',
  '0x31': 'Incorrect sequence number in message',
  '0x32': 'Inappropriate type of checksum in message',
  '0x3c': 'Generic error (description in e-text)',
  '0x3d': 'Field is too long for this implementation',
};

const KERBEROS_STATUS_CODES_JA: Record<string, string> = {
  '0x1':  'データベース内のクライアントのエントリの有効期限が切れています',
  '0x2':  'データベース内のサーバーのエントリの有効期限が切れています',
  '0x3':  '要求されたプロトコルバージョンはサポートされていません',
  '0x4':  'クライアントのキーが古いマスターキーで暗号化されています',
  '0x5':  'サーバーのキーが古いマスターキーで暗号化されています',
  '0x6':  'クライアントがKerberosデータベースに見つかりません（ユーザー名が誤っているかDCにまだレプリケートされていません）',
  '0x7':  'サーバーがKerberosデータベースに見つかりません（新しいコンピューターアカウントがまだレプリケートされていないかW2K以前）',
  '0x8':  'データベースに複数のプリンシパルエントリがあります',
  '0x9':  'クライアントまたはサーバーのキーがnullです（管理者はアカウントのパスワードをリセットしてください）',
  '0xa':  'チケットは事後日付の対象外です',
  '0xb':  '要求された開始時刻が終了時刻より後です',
  '0xc':  'KDCポリシーが要求を拒否しました（ワークステーション制限）',
  '0xd':  'KDCは要求されたオプションに対応できません',
  '0xe':  'KDCは暗号化タイプをサポートしていません',
  '0xf':  'KDCはチェックサムタイプをサポートしていません',
  '0x10': 'KDCはpadataタイプをサポートしていません',
  '0x11': 'KDCはtransitedタイプをサポートしていません',
  '0x12': 'クライアントの資格情報が失効しています（アカウントが無効・期限切れ・ロックアウト・ログオン時間制限）',
  '0x13': 'サーバーの資格情報が失効しています',
  '0x14': 'TGTが失効しています',
  '0x15': 'クライアントはまだ有効ではありません — しばらくしてから再試行してください',
  '0x16': 'サーバーはまだ有効ではありません — しばらくしてから再試行してください',
  '0x17': 'パスワードの有効期限が切れています',
  '0x18': '事前認証情報が無効です（通常はパスワードが間違っています）',
  '0x19': '追加の事前認証が必要です',
  '0x1f': '復号化されたフィールドの整合性チェックに失敗しました',
  '0x20': 'チケットの有効期限が切れています（コンピューターアカウントで頻繁に記録されます）',
  '0x21': 'チケットはまだ有効ではありません',
  '0x22': '要求はリプレイです',
  '0x23': 'チケットが対象外です',
  '0x24': 'チケットとオーセンティケーターが一致しません',
  '0x25': 'クロックスキューが大きすぎます（ワークステーションの時刻がDCと大きくずれています）',
  '0x26': 'ネットワークアドレスが正しくありません（IPアドレスが変更されましたか？）',
  '0x27': 'プロトコルバージョンの不一致',
  '0x28': '無効なメッセージタイプ',
  '0x29': 'メッセージストリームが変更されています',
  '0x2a': 'メッセージが順序外れです',
  '0x2c': '指定されたバージョンのキーは使用できません',
  '0x2d': 'サービスキーが使用できません',
  '0x2e': '相互認証に失敗しました（メモリ割り当て失敗の可能性があります）',
  '0x2f': 'メッセージの方向が正しくありません',
  '0x30': '代替認証方法が必要です',
  '0x31': 'メッセージのシーケンス番号が正しくありません',
  '0x32': 'メッセージ内のチェックサムのタイプが不適切です',
  '0x3c': '一般エラー（e-textに説明があります）',
  '0x3d': 'このimplementationではフィールドが長すぎます',
};

export function getKerberosStatusLabel(value: string, lang: 'ja' | 'en' = 'en'): string {
  let key = value.toLowerCase();
  if (!key.startsWith('0x')) {
    const n = parseInt(value, 10);
    if (!isNaN(n)) key = '0x' + n.toString(16);
  }
  const map = lang === 'ja' ? KERBEROS_STATUS_CODES_JA : KERBEROS_STATUS_CODES_EN;
  const label = map[key];
  return label ? `${key} — ${label}` : value;
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
