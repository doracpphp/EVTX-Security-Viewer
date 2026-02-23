export interface NormalizedEvent {
  id: number;           // record number (unique)
  eventId: number;
  timestamp: string;    // ISO 8601
  computer: string;
  level: number;
  user: string;
  description: string;
  logonType?: number;   // 4624 / 4625 only
  ipAddress?: string;   // 4624 / 4625 only
  raw: Record<string, unknown>;
}

export type TabId =
  | 'all'
  | '4624'
  | '4625'
  | '4634'
  | '4648'
  | '4672'
  | '4688'
  | '4698'
  | '4720'
  | '4724'
  | '4740'
  | '4776'
  | '7045'
  | 'other';

export interface TabDefinition {
  id: TabId;
  label: string;
  eventId?: number;
  description: string;
}

export type WorkerMessage =
  | { type: 'parse'; file: File }

export type WorkerResponse =
  | { type: 'progress'; processed: number; total: number }
  | { type: 'events'; events: NormalizedEvent[] }
  | { type: 'done' }
  | { type: 'error'; message: string }
