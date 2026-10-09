/**
 * Well-known Windows SIDs that represent system/built-in accounts.
 * Reference: https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-identifiers
 */
const SYSTEM_SIDS = new Set([
  'S-1-5-1',   // Dialup
  'S-1-5-2',   // Network
  'S-1-5-3',   // Batch
  'S-1-5-4',   // Interactive
  'S-1-5-6',   // Service
  'S-1-5-7',   // Anonymous Logon
  'S-1-5-8',   // Proxy
  'S-1-5-9',   // Enterprise Domain Controllers
  'S-1-5-10',  // Self
  'S-1-5-11',  // Authenticated Users
  'S-1-5-12',  // Restricted Code
  'S-1-5-13',  // Terminal Server User
  'S-1-5-14',  // Remote Interactive Logon
  'S-1-5-15',  // This Organization
  'S-1-5-17',  // IUSR
  'S-1-5-18',  // SYSTEM (Local System)
  'S-1-5-19',  // LOCAL SERVICE
  'S-1-5-20',  // NETWORK SERVICE
]);

/** SID prefixes that indicate system/service accounts */
const SYSTEM_SID_PREFIXES = [
  'S-1-5-80-',  // NT SERVICE\*
  'S-1-5-82-',  // AppContainer
  'S-1-5-83-',  // Hyper-V Virtual Machine
  'S-1-5-90-',  // Windows Manager
  'S-1-5-96-',  // Font Driver Host (UMFD-*)
];

/**
 * NULL SID. Windows writes it when no account could be resolved — e.g. every
 * 4625 (failed logon) has TargetUserSid S-1-0-0 — so it says nothing about
 * whether the account is a system account.
 */
const NULL_SID = 'S-1-0-0';

/** Built-in account names, used when no usable SID is available. */
const SYSTEM_USER_NAMES = new Set(['SYSTEM', 'LOCAL SERVICE', 'NETWORK SERVICE', 'ANONYMOUS LOGON']);
const SYSTEM_USER_NAME_PREFIXES = ['DWM-', 'UMFD-'];

/**
 * Returns true if the given SID belongs to a Windows built-in / system account.
 * Machine accounts (username ending with $) are also treated as system users.
 */
export function classifyIsSystemUser(sid: string, username: string): boolean {
  const name = username.split('\\').pop() ?? username;
  if (sid && sid !== NULL_SID) {
    if (SYSTEM_SIDS.has(sid) || SYSTEM_SID_PREFIXES.some(p => sid.startsWith(p))) return true;
  } else {
    const upper = name.toUpperCase();
    if (SYSTEM_USER_NAMES.has(upper) || SYSTEM_USER_NAME_PREFIXES.some(p => upper.startsWith(p))) {
      return true;
    }
  }
  // Machine accounts: computer accounts end with '$'
  return name.endsWith('$');
}
