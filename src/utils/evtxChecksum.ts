import type { Buffer } from 'buffer';

const CHUNK_MAGIC = 'ElfChnk\0';
const CHUNK_HEADER_SIZE = 512;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(parts: Uint8Array[]): number {
  let crc = 0xffffffff;
  for (const bytes of parts) {
    for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function hasChunkMagic(chunk: Buffer): boolean {
  return chunk.length >= CHUNK_HEADER_SIZE && chunk.toString('latin1', 0, 8) === CHUNK_MAGIC;
}

/**
 * Verifies both CRC32 checksums stored in an EVTX chunk header:
 *  - offset 124: header (bytes 0–120 and 128–512)
 *  - offset 52:  event records (bytes 512 up to the free-space offset at 48)
 */
export function chunkChecksumsValid(chunk: Buffer): boolean {
  if (crc32([chunk.subarray(0, 120), chunk.subarray(128, CHUNK_HEADER_SIZE)]) !== chunk.readUInt32LE(124)) {
    return false;
  }
  const freeSpaceOffset = chunk.readUInt32LE(48);
  if (freeSpaceOffset < CHUNK_HEADER_SIZE || freeSpaceOffset > chunk.length) return false;
  return crc32([chunk.subarray(CHUNK_HEADER_SIZE, freeSpaceOffset)]) === chunk.readUInt32LE(52);
}
