import { Buffer } from 'buffer';
import type { DataSource } from 'winevtx';

/**
 * Browser File → winevtx DataSource adapter.
 * Uses File.slice() to avoid loading the entire file into memory.
 */
export function createFileDataSource(file: File): DataSource {
  return {
    size: file.size,
    async readAt(offset: number, size: number): Promise<Buffer> {
      const blob = file.slice(offset, offset + size);
      const arrayBuffer = await blob.arrayBuffer();
      return Buffer.from(arrayBuffer);
    },
  };
}
