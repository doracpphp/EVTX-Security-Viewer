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
  isSystemUser: boolean;
  raw: Record<string, unknown>;
}


export type WorkerMessage =
  | { type: 'parse'; file: File }

export type WorkerResponse =
  | { type: 'progress'; processed: number; total: number }  // bytes read / file size
  | { type: 'events'; events: NormalizedEvent[] }
  | { type: 'done'; skippedChunks: number }
  | { type: 'error'; message: string }
