export interface SecurityEventDef {
  id: number;
  desc: string;
}

export interface SecuritySubcategory {
  name: string;      // Japanese (used as key)
  nameEn: string;    // English display name
  events: SecurityEventDef[];
}

export interface SecurityCategory {
  name: string;      // Japanese (used as key)
  nameEn: string;    // English display name
  subcategories: SecuritySubcategory[];
}

export const SECURITY_CATEGORIES: SecurityCategory[] = [
  {
    name: 'システム',
    nameEn: 'System',
    subcategories: [
      { name: 'セキュリティ システムの拡張', nameEn: 'Security System Extension', events: [
        { id: 4610, desc: 'An authentication package has been loaded by the LSA' },
        { id: 4611, desc: 'A trusted logon process has been registered with the LSA' },
        { id: 4614, desc: 'A notification package has been loaded by the SAM' },
        { id: 4622, desc: 'A security package has been loaded by the LSA' },
        { id: 4697, desc: 'A service was installed in the system' },
      ]},
      { name: 'システムの整合性', nameEn: 'System Integrity', events: [
        { id: 4612, desc: 'Internal resources allocated for audit messages have been exhausted' },
        { id: 4615, desc: 'Invalid use of LPC port' },
        { id: 4618, desc: 'A monitored security event pattern has occurred' },
        { id: 4816, desc: 'RPC detected an integrity violation while decrypting an incoming message' },
        { id: 5038, desc: 'Code integrity determined that image hash of a file is not valid' },
        { id: 5056, desc: 'A cryptographic self-test was performed' },
        { id: 5057, desc: 'A cryptographic primitive operation failed' },
        { id: 5060, desc: 'Verification operation failed' },
        { id: 5061, desc: 'Cryptographic operation' },
        { id: 5062, desc: 'A kernel-mode cryptographic self-test was performed' },
        { id: 6281, desc: 'Code Integrity determined that page hashes of an image file are not valid' },
        { id: 6410, desc: 'Code integrity determined that a file does not meet the security requirements to load into a process' },
      ]},
      { name: 'IPsec ドライバー', nameEn: 'IPsec Driver', events: [
        { id: 4960, desc: 'IPsec dropped an inbound packet that failed an integrity check' },
        { id: 4961, desc: 'IPsec dropped an inbound packet that failed a replay check' },
        { id: 4962, desc: 'IPsec dropped an inbound packet that failed a replay check (low sequence)' },
        { id: 4963, desc: 'IPsec dropped an inbound clear text packet that should have been secured' },
        { id: 4965, desc: 'IPsec received a packet from a remote computer with an incorrect SPI' },
        { id: 5478, desc: 'IPsec Services has started successfully' },
        { id: 5479, desc: 'IPsec Services has been shut down successfully' },
        { id: 5480, desc: 'IPsec Services failed to get the complete list of network interfaces' },
        { id: 5483, desc: 'IPsec Services failed to initialize RPC server' },
        { id: 5484, desc: 'IPsec Services has experienced a critical failure and has been shut down' },
        { id: 5485, desc: 'IPsec Services failed to process some IPsec filters on a plug-and-play event' },
      ]},
      { name: 'セキュリティ状態の変更', nameEn: 'Security State Change', events: [
        { id: 4608, desc: 'Windows is starting up' },
        { id: 4616, desc: 'The system time was changed' },
        { id: 4621, desc: 'Administrator recovered system from CrashOnAuditFail' },
      ]},
      { name: 'その他のシステム イベント', nameEn: 'Other System Events', events: [
        { id: 5024, desc: 'The Windows Firewall Service has started successfully' },
        { id: 5025, desc: 'The Windows Firewall Service has been stopped' },
        { id: 5027, desc: 'The Windows Firewall Service was unable to retrieve the security policy' },
        { id: 5028, desc: 'The Windows Firewall Service was unable to parse the new security policy' },
        { id: 5029, desc: 'The Windows Firewall Service failed to initialize the driver' },
        { id: 5030, desc: 'The Windows Firewall Service failed to start' },
        { id: 5032, desc: 'Windows Firewall was unable to notify the user that it blocked an application' },
        { id: 5033, desc: 'The Windows Firewall Driver has started successfully' },
        { id: 5034, desc: 'The Windows Firewall Driver was stopped' },
        { id: 5035, desc: 'The Windows Firewall Driver failed to start' },
        { id: 5037, desc: 'The Windows Firewall Driver detected critical runtime error' },
        { id: 5058, desc: 'Key file operation' },
        { id: 5059, desc: 'Key migration operation' },
        { id: 6400, desc: 'BranchCache: Received an incorrectly formatted response' },
        { id: 6401, desc: 'BranchCache: Received invalid data from a peer' },
        { id: 6402, desc: 'BranchCache: The message to the hosted cache is incorrectly formatted' },
        { id: 6403, desc: 'BranchCache: The hosted cache sent an incorrectly formatted response' },
        { id: 6404, desc: 'BranchCache: Hosted cache could not be authenticated' },
        { id: 6405, desc: 'BranchCache: event id occurred' },
        { id: 6406, desc: 'Registered to Windows Firewall to control filtering' },
        { id: 6407, desc: 'Windows Firewall event' },
        { id: 6408, desc: 'Registered product failed and Windows Firewall is now controlling filtering' },
        { id: 6409, desc: 'BranchCache: A service connection point object could not be parsed' },
      ]},
    ],
  },
  {
    name: 'ログオン/ログオフ',
    nameEn: 'Logon/Logoff',
    subcategories: [
      { name: 'ログオン', nameEn: 'Logon', events: [
        { id: 4624, desc: 'An account was successfully logged on' },
        { id: 4625, desc: 'An account failed to log on' },
        { id: 4648, desc: 'A logon was attempted using explicit credentials' },
        { id: 4675, desc: 'SIDs were filtered' },
      ]},
      { name: 'ログオフ', nameEn: 'Logoff', events: [
        { id: 4634, desc: 'An account was logged off' },
        { id: 4647, desc: 'User initiated logoff' },
      ]},
      { name: 'アカウント ロックアウト', nameEn: 'Account Lockout', events: [
        { id: 4625, desc: 'An account failed to log on' },
      ]},
      { name: 'IPsec メイン モード', nameEn: 'IPsec Main Mode', events: [
        { id: 4650, desc: 'An IPsec Main Mode security association was established' },
        { id: 4651, desc: 'An IPsec Main Mode security association was established (certificate)' },
        { id: 4652, desc: 'An IPsec Main Mode negotiation failed' },
        { id: 4653, desc: 'An IPsec Main Mode negotiation failed' },
        { id: 4655, desc: 'An IPsec Main Mode security association ended' },
        { id: 4976, desc: 'During Main Mode negotiation, IPsec received an invalid negotiation packet' },
        { id: 5049, desc: 'An IPsec Security Association was deleted' },
        { id: 5453, desc: 'An IPsec negotiation with a remote computer failed' },
      ]},
      { name: 'IPsec クイック モード', nameEn: 'IPsec Quick Mode', events: [
        { id: 4977, desc: 'During Quick Mode negotiation, IPsec received an invalid negotiation packet' },
        { id: 5451, desc: 'An IPsec Quick Mode security association was established' },
        { id: 5452, desc: 'An IPsec Quick Mode security association ended' },
      ]},
      { name: 'IPsec 拡張モード', nameEn: 'IPsec Extended Mode', events: [
        { id: 4978, desc: 'During Extended Mode negotiation, IPsec received an invalid negotiation packet' },
        { id: 4979, desc: 'IPsec Main Mode and Extended Mode security associations were established' },
        { id: 4980, desc: 'IPsec Main Mode and Extended Mode security associations were established' },
        { id: 4981, desc: 'IPsec Main Mode and Extended Mode security associations were established' },
        { id: 4982, desc: 'IPsec Main Mode and Extended Mode security associations were established' },
        { id: 4983, desc: 'An IPsec Extended Mode negotiation failed' },
        { id: 4984, desc: 'An IPsec Extended Mode negotiation failed' },
      ]},
      { name: '特殊なログオン', nameEn: 'Special Logon', events: [
        { id: 4964, desc: 'Special groups have been assigned to a new logon' },
        { id: 4672, desc: 'Special privileges assigned to new logon' },
      ]},
      { name: 'その他のログオン/ログオフ イベント', nameEn: 'Other Logon/Logoff Events', events: [
        { id: 4649, desc: 'A replay attack was detected' },
        { id: 4778, desc: 'A session was reconnected to a Window Station' },
        { id: 4779, desc: 'A session was disconnected from a Window Station' },
        { id: 4800, desc: 'The workstation was locked' },
        { id: 4801, desc: 'The workstation was unlocked' },
        { id: 4802, desc: 'The screen saver was invoked' },
        { id: 4803, desc: 'The screen saver was dismissed' },
        { id: 5378, desc: 'The requested credentials delegation was disallowed by policy' },
        { id: 5632, desc: 'A request was made to authenticate to a wireless network' },
        { id: 5633, desc: 'A request was made to authenticate to a wired network' },
      ]},
      { name: 'ネットワーク ポリシー サーバー', nameEn: 'Network Policy Server', events: [
        { id: 6272, desc: 'Network Policy Server granted access to a user' },
        { id: 6273, desc: 'Network Policy Server denied access to a user' },
        { id: 6274, desc: 'Network Policy Server discarded the request for a user' },
        { id: 6275, desc: 'Network Policy Server discarded the accounting request for a user' },
        { id: 6276, desc: 'Network Policy Server quarantined a user' },
        { id: 6277, desc: 'Network Policy Server granted access to a user but put it on probation' },
        { id: 6278, desc: 'Network Policy Server granted full access to a user' },
        { id: 6279, desc: 'Network Policy Server locked the user account' },
        { id: 6280, desc: 'Network Policy Server unlocked the user account' },
      ]},
      { name: 'ユーザー要求/デバイスの信頼性情報', nameEn: 'User/Device Claims', events: [
        { id: 4626, desc: 'User/Device claims information' },
      ]},
      { name: 'グループ メンバーシップ', nameEn: 'Group Membership', events: [
        { id: 4627, desc: 'Group membership information' },
      ]},
    ],
  },
  {
    name: 'オブジェクト アクセス',
    nameEn: 'Object Access',
    subcategories: [
      { name: 'ファイル システム', nameEn: 'File System', events: [
        { id: 4656, desc: 'A handle to an object was requested' },
        { id: 4658, desc: 'The handle to an object was closed' },
        { id: 4660, desc: 'An object was deleted' },
        { id: 4663, desc: 'An attempt was made to access an object' },
        { id: 4664, desc: 'An attempt was made to create a hard link' },
        { id: 4670, desc: 'Permissions on an object were changed' },
        { id: 4985, desc: 'The state of a transaction has changed' },
        { id: 5051, desc: 'A file was virtualized' },
      ]},
      { name: 'レジストリ', nameEn: 'Registry', events: [
        { id: 4656, desc: 'A handle to an object was requested' },
        { id: 4657, desc: 'A registry value was modified' },
        { id: 4658, desc: 'The handle to an object was closed' },
        { id: 4660, desc: 'An object was deleted' },
        { id: 4663, desc: 'An attempt was made to access an object' },
        { id: 4670, desc: 'Permissions on an object were changed' },
        { id: 5039, desc: 'A registry key was virtualized' },
      ]},
      { name: 'カーネル オブジェクト', nameEn: 'Kernel Object', events: [
        { id: 4656, desc: 'A handle to an object was requested' },
        { id: 4658, desc: 'The handle to an object was closed' },
        { id: 4660, desc: 'An object was deleted' },
        { id: 4663, desc: 'An attempt was made to access an object' },
      ]},
      { name: 'SAM', nameEn: 'SAM', events: [
        { id: 4661, desc: 'A handle to an object was requested' },
      ]},
      { name: '証明書サービス', nameEn: 'Certification Services', events: [
        { id: 4868, desc: 'The certificate manager denied a pending certificate request' },
        { id: 4869, desc: 'Certificate Services received a resubmitted certificate request' },
        { id: 4870, desc: 'Certificate Services revoked a certificate' },
        { id: 4871, desc: 'Certificate Services received a request to publish the CRL' },
        { id: 4872, desc: 'Certificate Services published the certificate revocation list (CRL)' },
        { id: 4873, desc: 'A certificate request extension changed' },
        { id: 4874, desc: 'One or more certificate request attributes changed' },
        { id: 4875, desc: 'Certificate Services received a request to shut down' },
        { id: 4876, desc: 'Certificate Services backup started' },
        { id: 4877, desc: 'Certificate Services backup completed' },
        { id: 4878, desc: 'Certificate Services restore started' },
        { id: 4879, desc: 'Certificate Services restore completed' },
        { id: 4880, desc: 'Certificate Services started' },
        { id: 4881, desc: 'Certificate Services stopped' },
        { id: 4882, desc: 'The security permissions for Certificate Services changed' },
        { id: 4883, desc: 'Certificate Services retrieved an archived key' },
        { id: 4884, desc: 'Certificate Services imported a certificate into its database' },
        { id: 4885, desc: 'The audit filter for Certificate Services changed' },
        { id: 4886, desc: 'Certificate Services received a certificate request' },
        { id: 4887, desc: 'Certificate Services approved a certificate request and issued a certificate' },
        { id: 4888, desc: 'Certificate Services denied a certificate request' },
        { id: 4889, desc: 'Certificate Services set the status of a certificate request to pending' },
        { id: 4890, desc: 'The certificate manager settings for Certificate Services changed' },
        { id: 4891, desc: 'A configuration entry changed in Certificate Services' },
        { id: 4892, desc: 'A property of Certificate Services changed' },
        { id: 4893, desc: 'Certificate Services archived a key' },
        { id: 4894, desc: 'Certificate Services imported and archived a key' },
        { id: 4895, desc: 'Certificate Services published the CA certificate to Active Directory' },
        { id: 4896, desc: 'One or more rows have been deleted from the certificate database' },
        { id: 4897, desc: 'Role separation enabled' },
        { id: 4898, desc: 'Certificate Services loaded a template' },
      ]},
      { name: '生成されたアプリケーション', nameEn: 'Application Generated', events: [
        { id: 4665, desc: 'An attempt was made to create an application client context' },
        { id: 4666, desc: 'An application attempted an operation' },
        { id: 4667, desc: 'An application client context was deleted' },
        { id: 4668, desc: 'An application was initialized' },
      ]},
      { name: 'ハンドル操作', nameEn: 'Handle Manipulation', events: [
        { id: 4658, desc: 'The handle to an object was closed' },
        { id: 4690, desc: 'An attempt was made to duplicate a handle to an object' },
      ]},
      { name: 'ファイルの共有', nameEn: 'File Share', events: [
        { id: 5140, desc: 'A network share object was accessed' },
        { id: 5142, desc: 'A network share object was added' },
        { id: 5143, desc: 'A network share object was modified' },
        { id: 5144, desc: 'A network share object was deleted' },
        { id: 5168, desc: 'SPN check for SMB/SMB2 failed' },
      ]},
      { name: 'フィルタリング プラットフォーム パケットのドロップ', nameEn: 'Filtering Platform Packet Drop', events: [
        { id: 5152, desc: 'The Windows Filtering Platform blocked a packet' },
        { id: 5153, desc: 'A more restrictive Windows Filtering Platform filter has blocked a packet' },
      ]},
      { name: 'フィルタリング プラットフォームの接続', nameEn: 'Filtering Platform Connection', events: [
        { id: 5031, desc: 'The Windows Firewall Service blocked an application from accepting incoming connections' },
        { id: 5150, desc: 'The Windows Filtering Platform blocked a packet' },
        { id: 5151, desc: 'A more restrictive Windows Filtering Platform filter has blocked a packet' },
        { id: 5154, desc: 'The Windows Filtering Platform has permitted an application or service to listen on a port' },
        { id: 5155, desc: 'The Windows Filtering Platform has blocked an application or service from listening on a port' },
        { id: 5156, desc: 'The Windows Filtering Platform has permitted a connection' },
        { id: 5157, desc: 'The Windows Filtering Platform has blocked a connection' },
        { id: 5158, desc: 'The Windows Filtering Platform has permitted a bind to a local port' },
        { id: 5159, desc: 'The Windows Filtering Platform has blocked a bind to a local port' },
      ]},
      { name: 'その他のオブジェクト アクセス イベント', nameEn: 'Other Object Access Events', events: [
        { id: 4671, desc: 'An application attempted to access a blocked ordinal through the TBS' },
        { id: 4691, desc: 'Indirect access to an object was requested' },
        { id: 4698, desc: 'A scheduled task was created' },
        { id: 4699, desc: 'A scheduled task was deleted' },
        { id: 4700, desc: 'A scheduled task was enabled' },
        { id: 4701, desc: 'A scheduled task was disabled' },
        { id: 4702, desc: 'A scheduled task was updated' },
        { id: 5148, desc: 'The Windows Filtering Platform has detected a DoS attack' },
        { id: 5149, desc: 'The DoS attack has subsided and normal processing is being resumed' },
        { id: 5888, desc: 'An object in the COM+ Catalog was modified' },
        { id: 5889, desc: 'An object was deleted from the COM+ Catalog' },
        { id: 5890, desc: 'An object was added to the COM+ Catalog' },
      ]},
      { name: '詳細なファイル共有', nameEn: 'Detailed File Share', events: [
        { id: 5145, desc: 'A network share object was checked to see whether client can be granted desired access' },
      ]},
      { name: 'リムーバブル記憶域', nameEn: 'Removable Storage', events: [
        { id: 4656, desc: 'A handle to an object was requested' },
        { id: 4658, desc: 'The handle to an object was closed' },
        { id: 4663, desc: 'An attempt was made to access an object' },
      ]},
      { name: '集約型ポリシー ステージング', nameEn: 'Central Policy Staging', events: [
        { id: 4818, desc: 'Proposed Central Access Policy does not grant the same access permissions' },
      ]},
    ],
  },
  {
    name: '特権の使用',
    nameEn: 'Privilege Use',
    subcategories: [
      { name: '重要でない特権の使用', nameEn: 'Non Sensitive Privilege Use', events: [
        { id: 4673, desc: 'A privileged service was called' },
        { id: 4674, desc: 'An operation was attempted on a privileged object' },
        { id: 4985, desc: 'The state of a transaction has changed' },
      ]},
      { name: '重要な特権の使用', nameEn: 'Sensitive Privilege Use', events: [
        { id: 4673, desc: 'A privileged service was called' },
        { id: 4674, desc: 'An operation was attempted on a privileged object' },
        { id: 4985, desc: 'The state of a transaction has changed' },
      ]},
      { name: 'その他の特権の使用イベント', nameEn: 'Other Privilege Use Events', events: [
        { id: 4985, desc: 'The state of a transaction has changed' },
      ]},
    ],
  },
  {
    name: '詳細追跡',
    nameEn: 'Detailed Tracking',
    subcategories: [
      { name: 'プロセス作成', nameEn: 'Process Creation', events: [
        { id: 4688, desc: 'A new process has been created' },
        { id: 4696, desc: 'A primary token was assigned to process' },
      ]},
      { name: 'プロセス終了', nameEn: 'Process Termination', events: [
        { id: 4689, desc: 'A process has exited' },
      ]},
      { name: 'DPAPI アクティビティ', nameEn: 'DPAPI Activity', events: [
        { id: 4692, desc: 'Backup of data protection master key was attempted' },
        { id: 4693, desc: 'Recovery of data protection master key was attempted' },
        { id: 4694, desc: 'Protection of auditable protected data was attempted' },
        { id: 4695, desc: 'Unprotection of auditable protected data was attempted' },
      ]},
      { name: 'RPC イベント', nameEn: 'RPC Events', events: [
        { id: 5712, desc: 'A Remote Procedure Call (RPC) was attempted' },
      ]},
      { name: 'プラグ アンド プレイ イベント', nameEn: 'Plug and Play Events', events: [
        { id: 6416, desc: 'A new external device was recognized by the System' },
        { id: 6419, desc: 'A request was made to disable a device' },
        { id: 6420, desc: 'A device was disabled' },
        { id: 6421, desc: 'A request was made to enable a device' },
        { id: 6422, desc: 'A device was enabled' },
        { id: 6423, desc: 'The installation of this device is forbidden by system policy' },
        { id: 6424, desc: 'The installation of this device was allowed, after having previously been forbidden by policy' },
      ]},
      { name: 'トークン権限調整済みイベント', nameEn: 'Token Right Adjusted Events', events: [
        { id: 4703, desc: 'A user right was adjusted' },
      ]},
    ],
  },
  {
    name: 'ポリシーの変更',
    nameEn: 'Policy Change',
    subcategories: [
      { name: 'ポリシーの変更の監査', nameEn: 'Audit Policy Change', events: [
        { id: 4715, desc: 'The audit policy (SACL) on an object was changed' },
        { id: 4719, desc: 'System audit policy was changed' },
        { id: 4817, desc: 'Auditing settings on object were changed' },
        { id: 4902, desc: 'The Per-user audit policy table was created' },
        { id: 4904, desc: 'An attempt was made to register a security event source' },
        { id: 4905, desc: 'An attempt was made to unregister a security event source' },
        { id: 4906, desc: 'The CrashOnAuditFail value has changed' },
        { id: 4907, desc: 'Auditing settings on object were changed' },
        { id: 4908, desc: 'Special Groups Logon table modified' },
        { id: 4912, desc: 'Per User Audit Policy was changed' },
      ]},
      { name: 'ポリシーの変更の認証', nameEn: 'Authentication Policy Change', events: [
        { id: 4670, desc: 'Permissions on an object were changed' },
        { id: 4706, desc: 'A new trust was created to a domain' },
        { id: 4707, desc: 'A trust to a domain was removed' },
        { id: 4713, desc: 'Kerberos policy was changed' },
        { id: 4716, desc: 'Trusted domain information was modified' },
        { id: 4717, desc: 'System security access was granted to an account' },
        { id: 4718, desc: 'System security access was removed from an account' },
        { id: 4739, desc: 'Domain Policy was changed' },
        { id: 4864, desc: 'A namespace collision was detected' },
        { id: 4865, desc: 'A trusted forest information entry was added' },
        { id: 4866, desc: 'A trusted forest information entry was removed' },
        { id: 4867, desc: 'A trusted forest information entry was modified' },
      ]},
      { name: 'ポリシーの変更の承認', nameEn: 'Authorization Policy Change', events: [
        { id: 4670, desc: 'Permissions on an object were changed' },
        { id: 4703, desc: 'A user right was adjusted' },
        { id: 4704, desc: 'A user right was assigned' },
        { id: 4705, desc: 'A user right was removed' },
        { id: 4911, desc: 'Resource attributes of the object were changed' },
        { id: 4913, desc: 'Central Access Policy on the object was changed' },
      ]},
      { name: 'MPSSVC ルールレベル ポリシーの変更', nameEn: 'MPSSVC Rule-Level Policy Change', events: [
        { id: 4944, desc: 'The following policy was active when the Windows Firewall started' },
        { id: 4945, desc: 'A rule was listed when the Windows Firewall started' },
        { id: 4946, desc: 'A change has been made to Windows Firewall exception list. A rule was added' },
        { id: 4947, desc: 'A change has been made to Windows Firewall exception list. A rule was modified' },
        { id: 4948, desc: 'A change has been made to Windows Firewall exception list. A rule was deleted' },
        { id: 4949, desc: 'Windows Firewall settings were restored to the default values' },
        { id: 4950, desc: 'A Windows Firewall setting has changed' },
        { id: 4951, desc: 'A rule has been ignored because its major version number was not recognized' },
        { id: 4952, desc: 'Parts of a rule have been ignored because its minor version number was not recognized' },
        { id: 4953, desc: 'A rule has been ignored by Windows Firewall because it could not parse the rule' },
        { id: 4954, desc: 'Windows Firewall Group Policy settings have changed' },
        { id: 4956, desc: 'Windows Firewall has changed the active profile' },
        { id: 4957, desc: 'Windows Firewall did not apply the following rule' },
        { id: 4958, desc: 'Windows Firewall did not apply the following rule because the rule referred to items not configured' },
      ]},
      { name: 'フィルタリング プラットフォームのポリシーの変更', nameEn: 'Filtering Platform Policy Change', events: [
        { id: 4709, desc: 'IPsec Services was started' },
        { id: 4710, desc: 'IPsec Services was disabled' },
        { id: 4711, desc: 'PAStore Engine event' },
        { id: 4712, desc: 'IPsec Services encountered a potentially serious failure' },
        { id: 5040, desc: 'A change has been made to IPsec settings. An Authentication Set was added' },
        { id: 5041, desc: 'A change has been made to IPsec settings. An Authentication Set was modified' },
        { id: 5042, desc: 'A change has been made to IPsec settings. An Authentication Set was deleted' },
        { id: 5043, desc: 'A change has been made to IPsec settings. A Connection Security Rule was added' },
        { id: 5044, desc: 'A change has been made to IPsec settings. A Connection Security Rule was modified' },
        { id: 5045, desc: 'A change has been made to IPsec settings. A Connection Security Rule was deleted' },
        { id: 5046, desc: 'A change has been made to IPsec settings. A Crypto Set was added' },
        { id: 5047, desc: 'A change has been made to IPsec settings. A Crypto Set was modified' },
        { id: 5048, desc: 'A change has been made to IPsec settings. A Crypto Set was deleted' },
        { id: 5440, desc: 'The following callout was present when the Windows Filtering Platform Base Filtering Engine started' },
        { id: 5441, desc: 'The following filter was present when the Windows Filtering Platform Base Filtering Engine started' },
        { id: 5442, desc: 'The following provider was present when the Windows Filtering Platform Base Filtering Engine started' },
        { id: 5443, desc: 'The following provider context was present when the Windows Filtering Platform Base Filtering Engine started' },
        { id: 5444, desc: 'The following sub-layer was present when the Windows Filtering Platform Base Filtering Engine started' },
        { id: 5446, desc: 'A Windows Filtering Platform callout has been changed' },
        { id: 5448, desc: 'A Windows Filtering Platform provider has been changed' },
        { id: 5449, desc: 'A Windows Filtering Platform provider context has been changed' },
        { id: 5450, desc: 'A Windows Filtering Platform sub-layer has been changed' },
        { id: 5456, desc: 'PAStore Engine applied Active Directory storage IPsec policy' },
        { id: 5457, desc: 'PAStore Engine failed to apply Active Directory storage IPsec policy' },
        { id: 5458, desc: 'PAStore Engine applied locally cached copy of Active Directory storage IPsec policy' },
        { id: 5459, desc: 'PAStore Engine failed to apply locally cached copy of Active Directory storage IPsec policy' },
        { id: 5460, desc: 'PAStore Engine applied local registry storage IPsec policy' },
        { id: 5461, desc: 'PAStore Engine failed to apply local registry storage IPsec policy' },
        { id: 5462, desc: 'PAStore Engine failed to apply some rules of the active IPsec policy' },
        { id: 5463, desc: 'PAStore Engine polled for changes to the active IPsec policy and detected no changes' },
        { id: 5464, desc: 'PAStore Engine polled for changes to the active IPsec policy, detected changes, and applied them' },
        { id: 5465, desc: 'PAStore Engine received a control for forced reloading of IPsec policy' },
        { id: 5466, desc: 'PAStore Engine polled for changes to the Active Directory IPsec policy, determined that Active Directory cannot be reached' },
        { id: 5467, desc: 'PAStore Engine polled for changes to the Active Directory IPsec policy, determined that Active Directory can be reached, found no changes' },
        { id: 5468, desc: 'PAStore Engine polled for changes to the Active Directory IPsec policy, determined that Active Directory can be reached, found changes' },
        { id: 5471, desc: 'PAStore Engine loaded local storage IPsec policy' },
        { id: 5472, desc: 'PAStore Engine failed to load local storage IPsec policy' },
        { id: 5473, desc: 'PAStore Engine loaded directory storage IPsec policy' },
        { id: 5474, desc: 'PAStore Engine failed to load directory storage IPsec policy' },
        { id: 5477, desc: 'PAStore Engine failed to add quick mode filter' },
      ]},
      { name: 'その他のポリシー変更イベント', nameEn: 'Other Policy Change Events', events: [
        { id: 4714, desc: 'Encrypted data recovery policy was changed' },
        { id: 4819, desc: 'Central Access Policies on the machine have been changed' },
        { id: 4826, desc: 'Boot Configuration Data loaded' },
        { id: 4909, desc: 'The local policy settings for the TBS were changed' },
        { id: 4910, desc: 'The group policy settings for the TBS were changed' },
        { id: 5063, desc: 'A cryptographic provider operation was attempted' },
        { id: 5064, desc: 'A cryptographic context operation was attempted' },
        { id: 5065, desc: 'A cryptographic context modification was attempted' },
        { id: 5066, desc: 'A cryptographic function operation was attempted' },
        { id: 5067, desc: 'A cryptographic function modification was attempted' },
        { id: 5068, desc: 'A cryptographic function provider operation was attempted' },
        { id: 5069, desc: 'A cryptographic function property operation was attempted' },
        { id: 5070, desc: 'A cryptographic function property modification was attempted' },
        { id: 5447, desc: 'A Windows Filtering Platform filter has been changed' },
        { id: 6144, desc: 'Security policy in the group policy objects has been applied successfully' },
        { id: 6145, desc: 'One or more errors occurred while processing security policy in the group policy objects' },
      ]},
    ],
  },
  {
    name: 'アカウント管理',
    nameEn: 'Account Management',
    subcategories: [
      { name: 'ユーザー アカウント管理', nameEn: 'User Account Management', events: [
        { id: 4720, desc: 'A user account was created' },
        { id: 4722, desc: 'A user account was enabled' },
        { id: 4723, desc: "An attempt was made to change an account's password" },
        { id: 4724, desc: "An attempt was made to reset an account's password" },
        { id: 4725, desc: 'A user account was disabled' },
        { id: 4726, desc: 'A user account was deleted' },
        { id: 4738, desc: 'A user account was changed' },
        { id: 4740, desc: 'A user account was locked out' },
        { id: 4765, desc: 'SID History was added to an account' },
        { id: 4766, desc: 'An attempt to add SID History to an account failed' },
        { id: 4767, desc: 'A user account was unlocked' },
        { id: 4780, desc: 'The ACL was set on accounts which are members of administrators groups' },
        { id: 4781, desc: 'The name of an account was changed' },
        { id: 4794, desc: 'An attempt was made to set the Directory Services Restore Mode administrator password' },
        { id: 4798, desc: "A user's local group membership was enumerated" },
        { id: 5376, desc: 'Credential Manager credentials were backed up' },
        { id: 5377, desc: 'Credential Manager credentials were restored from a backup' },
      ]},
      { name: 'コンピューター アカウント管理', nameEn: 'Computer Account Management', events: [
        { id: 4741, desc: 'A computer account was created' },
        { id: 4742, desc: 'A computer account was changed' },
        { id: 4743, desc: 'A computer account was deleted' },
      ]},
      { name: 'セキュリティ グループ管理', nameEn: 'Security Group Management', events: [
        { id: 4731, desc: 'A security-enabled local group was created' },
        { id: 4732, desc: 'A member was added to a security-enabled local group' },
        { id: 4733, desc: 'A member was removed from a security-enabled local group' },
        { id: 4734, desc: 'A security-enabled local group was deleted' },
        { id: 4735, desc: 'A security-enabled local group was changed' },
        { id: 4764, desc: "A group's type was changed" },
        { id: 4799, desc: 'A security-enabled local group membership was enumerated' },
      ]},
      { name: '配布グループの管理', nameEn: 'Distribution Group Management', events: [
        { id: 4744, desc: 'A security-disabled local group was created' },
        { id: 4745, desc: 'A security-disabled local group was changed' },
        { id: 4746, desc: 'A member was added to a security-disabled local group' },
        { id: 4747, desc: 'A member was removed from a security-disabled local group' },
        { id: 4748, desc: 'A security-disabled local group was deleted' },
        { id: 4749, desc: 'A security-disabled global group was created' },
        { id: 4750, desc: 'A security-disabled global group was changed' },
        { id: 4751, desc: 'A member was added to a security-disabled global group' },
        { id: 4752, desc: 'A member was removed from a security-disabled global group' },
        { id: 4753, desc: 'A security-disabled global group was deleted' },
        { id: 4759, desc: 'A security-disabled universal group was created' },
        { id: 4760, desc: 'A security-disabled universal group was changed' },
        { id: 4761, desc: 'A member was added to a security-disabled universal group' },
        { id: 4762, desc: 'A member was removed from a security-disabled universal group' },
        { id: 4763, desc: 'A security-disabled universal group was deleted' },
      ]},
      { name: 'アプリケーション グループの管理', nameEn: 'Application Group Management', events: [
        { id: 4783, desc: 'A basic application group was created' },
        { id: 4784, desc: 'A basic application group was changed' },
        { id: 4785, desc: 'A member was added to a basic application group' },
        { id: 4786, desc: 'A member was removed from a basic application group' },
        { id: 4787, desc: 'A non-member was added to a basic application group' },
        { id: 4788, desc: 'A non-member was removed from a basic application group' },
        { id: 4789, desc: 'A basic application group was deleted' },
        { id: 4790, desc: 'An LDAP query group was created' },
        { id: 4791, desc: 'An LDAP query group was changed' },
        { id: 4792, desc: 'An LDAP query group was deleted' },
      ]},
      { name: 'その他のアカウント管理イベント', nameEn: 'Other Account Management Events', events: [
        { id: 4782, desc: 'The password hash of an account was accessed' },
        { id: 4793, desc: 'The Password Policy Checking API was called' },
      ]},
    ],
  },
  {
    name: 'DS アクセス',
    nameEn: 'DS Access',
    subcategories: [
      { name: 'ディレクトリ サービス アクセス', nameEn: 'Directory Service Access', events: [
        { id: 4661, desc: 'A handle to an object was requested' },
        { id: 4662, desc: 'An operation was performed on an object' },
      ]},
      { name: 'ディレクトリ サービスの変更', nameEn: 'Directory Service Changes', events: [
        { id: 5136, desc: 'A directory service object was modified' },
        { id: 5137, desc: 'A directory service object was created' },
        { id: 5138, desc: 'A directory service object was undeleted' },
        { id: 5139, desc: 'A directory service object was moved' },
        { id: 5141, desc: 'A directory service object was deleted' },
      ]},
      { name: 'ディレクトリ サービスのレプリケーション', nameEn: 'Directory Service Replication', events: [
        { id: 4932, desc: 'Synchronization of a replica of an Active Directory naming context has begun' },
        { id: 4933, desc: 'Synchronization of a replica of an Active Directory naming context has ended' },
      ]},
      { name: '詳細なディレクトリ サービス レプリケーション', nameEn: 'Detailed Directory Service Replication', events: [
        { id: 4928, desc: 'An Active Directory replica source naming context was established' },
        { id: 4929, desc: 'An Active Directory replica source naming context was removed' },
        { id: 4930, desc: 'An Active Directory replica source naming context was modified' },
        { id: 4931, desc: 'An Active Directory replica destination naming context was modified' },
        { id: 4934, desc: 'Attributes of an Active Directory object were replicated' },
        { id: 4935, desc: 'Replication failure begins' },
        { id: 4936, desc: 'Replication failure ends' },
        { id: 4937, desc: 'A lingering object was removed from a replica' },
      ]},
    ],
  },
  {
    name: 'アカウント ログオン',
    nameEn: 'Account Logon',
    subcategories: [
      { name: 'Kerberos サービス チケット操作', nameEn: 'Kerberos Service Ticket Operations', events: [
        { id: 4769, desc: 'A Kerberos service ticket was requested' },
        { id: 4770, desc: 'A Kerberos service ticket was renewed' },
        { id: 4773, desc: 'A Kerberos service ticket request failed' },
      ]},
      { name: 'Kerberos 認証サービス', nameEn: 'Kerberos Authentication Service', events: [
        { id: 4768, desc: 'A Kerberos authentication ticket (TGT) was requested' },
        { id: 4771, desc: 'Kerberos pre-authentication failed' },
        { id: 4772, desc: 'A Kerberos authentication ticket request failed' },
      ]},
      { name: 'その他のアカウント ログオン イベント', nameEn: 'Other Account Logon Events', events: [
        { id: 4776, desc: 'The computer attempted to validate the credentials for an account' },
        { id: 4777, desc: 'The domain controller failed to validate the credentials for an account' },
      ]},
    ],
  },
  {
    name: 'その他',
    nameEn: 'Other',
    subcategories: [
      { name: 'イベント ログ', nameEn: 'Event Log', events: [
        { id: 1100, desc: 'The event logging service has shut down' },
        { id: 1102, desc: 'The audit log was cleared' },
        { id: 1104, desc: 'The security log is now full' },
        { id: 1105, desc: 'Event log automatic backup' },
        { id: 1108, desc: 'The event logging service encountered an error' },
      ]},
    ],
  },
];

// Build a flat set of all known event IDs for "other" category filtering
export const ALL_KNOWN_EVENT_IDS = new Set<number>(
  SECURITY_CATEGORIES.flatMap(c => c.subcategories.flatMap(s => s.events.map(e => e.id)))
);

// Get unique event IDs for a subcategory (deduplicated)
export function getSubcategoryEventIds(categoryName: string, subcategoryName: string): Set<number> {
  const cat = SECURITY_CATEGORIES.find(c => c.name === categoryName);
  const sub = cat?.subcategories.find(s => s.name === subcategoryName);
  return new Set(sub?.events.map(e => e.id) ?? []);
}

// Get unique event IDs for a category (deduplicated)
export function getCategoryEventIds(categoryName: string): Set<number> {
  const cat = SECURITY_CATEGORIES.find(c => c.name === categoryName);
  return new Set(cat?.subcategories.flatMap(s => s.events.map(e => e.id)) ?? []);
}

// Get unique event defs for a subcategory (deduplicated by ID)
export function getUniqueSubcategoryEvents(categoryName: string, subcategoryName: string): SecurityEventDef[] {
  const cat = SECURITY_CATEGORIES.find(c => c.name === categoryName);
  const sub = cat?.subcategories.find(s => s.name === subcategoryName);
  const seen = new Set<number>();
  return (sub?.events ?? []).filter(e => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}
