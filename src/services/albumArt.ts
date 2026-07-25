import { File } from 'expo-file-system';

// Embedded cover art typically sits within the first few hundred KB of a file
// (ID3v2 tags are always at the very start of an MP3; a "faststart" MP4/M4A
// puts its metadata atom near the start too). Reading only a bounded prefix
// keeps this fast for a whole on-device library instead of loading full
// multi-MB audio files into memory.
const PREFIX_BYTES = 512 * 1024;

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64(bytes: Uint8Array): string {
  let result = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < len ? bytes[i + 1] : 0;
    const b3 = i + 2 < len ? bytes[i + 2] : 0;
    const triplet = (b1 << 16) | (b2 << 8) | b3;
    result += BASE64_CHARS[(triplet >> 18) & 0x3f];
    result += BASE64_CHARS[(triplet >> 12) & 0x3f];
    result += i + 1 < len ? BASE64_CHARS[(triplet >> 6) & 0x3f] : '=';
    result += i + 2 < len ? BASE64_CHARS[triplet & 0x3f] : '=';
  }
  return result;
}

interface EmbeddedArt {
  mimeType: string;
  bytes: Uint8Array;
}

function readSynchsafeInt(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset] & 0x7f) << 21) |
    ((bytes[offset + 1] & 0x7f) << 14) |
    ((bytes[offset + 2] & 0x7f) << 7) |
    (bytes[offset + 3] & 0x7f)
  );
}

function readUint32BE(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
}

// Parses an ID3v2.3/2.4 tag (the format used by the vast majority of MP3s)
// looking for an APIC (attached picture) frame.
function findId3ApicFrame(bytes: Uint8Array): EmbeddedArt | null {
  if (bytes.length < 10 || bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return null; // "ID3"
  const majorVersion = bytes[3];
  const flags = bytes[5];
  const tagSize = readSynchsafeInt(bytes, 6);

  let offset = 10;
  const hasExtendedHeader = (flags & 0x40) !== 0;
  if (hasExtendedHeader && offset + 4 <= bytes.length) {
    const extSize = majorVersion === 4 ? readSynchsafeInt(bytes, offset) : readUint32BE(bytes, offset);
    offset += extSize;
  }

  const tagEnd = Math.min(bytes.length, 10 + tagSize);
  while (offset + 10 <= tagEnd) {
    const frameId = String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
    if (frameId === '\0\0\0\0') break;
    const frameSize = majorVersion === 4 ? readSynchsafeInt(bytes, offset + 4) : readUint32BE(bytes, offset + 4);
    const frameStart = offset + 10;
    if (frameId === 'APIC') {
      return parseApicFrame(bytes, frameStart, Math.min(frameSize, tagEnd - frameStart));
    }
    if (frameSize <= 0) break;
    offset = frameStart + frameSize;
  }
  return null;
}

function parseApicFrame(bytes: Uint8Array, start: number, size: number): EmbeddedArt | null {
  if (size <= 0) return null;
  const end = start + size;
  let pos = start + 1; // byte 0 is the text-encoding flag, not needed below

  let mimeEnd = pos;
  while (mimeEnd < end && bytes[mimeEnd] !== 0) mimeEnd++;
  const mimeType = Array.from(bytes.slice(pos, mimeEnd))
    .map((b) => String.fromCharCode(b))
    .join('');
  pos = mimeEnd + 1;

  pos += 1; // picture type byte
  const textEncoding = bytes[start];
  const isDoubleByteNull = textEncoding === 1 || textEncoding === 2;
  if (isDoubleByteNull) {
    while (pos + 1 < end && !(bytes[pos] === 0 && bytes[pos + 1] === 0)) pos += 2;
    pos += 2;
  } else {
    while (pos < end && bytes[pos] !== 0) pos++;
    pos += 1;
  }

  const imageBytes = bytes.slice(pos, end);
  if (imageBytes.length === 0) return null;
  return { mimeType: mimeType || 'image/jpeg', bytes: imageBytes };
}

// Walks MP4/M4A's box structure (moov > udta > meta > ilst > covr > data) to
// find embedded cover art. Only works when the moov atom appears within the
// prefix we read — true for "faststart"-encoded files, which covers most
// exports from iTunes/ffmpeg, but not every M4A in the wild.
function findMp4CoverArt(bytes: Uint8Array): EmbeddedArt | null {
  function boxType(pos: number) {
    return String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
  }

  function walk(start: number, end: number, parent: string): EmbeddedArt | null {
    let pos = start;
    while (pos + 8 <= end) {
      const size = readUint32BE(bytes, pos);
      const type = boxType(pos);
      if (size < 8) break;
      const boxEnd = Math.min(end, pos + size);

      if (parent === 'root' && type === 'moov') {
        const found = walk(pos + 8, boxEnd, 'moov');
        if (found) return found;
      } else if (parent === 'moov' && type === 'udta') {
        const found = walk(pos + 8, boxEnd, 'udta');
        if (found) return found;
      } else if (parent === 'udta' && type === 'meta') {
        const found = walk(pos + 12, boxEnd, 'meta'); // meta has a 4-byte version/flags prefix
        if (found) return found;
      } else if (parent === 'meta' && type === 'ilst') {
        const found = walk(pos + 8, boxEnd, 'ilst');
        if (found) return found;
      } else if (parent === 'ilst' && type === 'covr') {
        const dataPos = pos + 8;
        if (dataPos + 16 <= boxEnd && boxType(dataPos) === 'data') {
          const dataSize = readUint32BE(bytes, dataPos);
          const flags = readUint32BE(bytes, dataPos + 8) & 0xffffff;
          const imgStart = dataPos + 16;
          const imgEnd = Math.min(dataPos + dataSize, boxEnd);
          const imageBytes = bytes.slice(imgStart, imgEnd);
          if (imageBytes.length > 0) {
            return { mimeType: flags === 14 ? 'image/png' : 'image/jpeg', bytes: imageBytes };
          }
        }
      }

      pos = boxEnd;
    }
    return null;
  }

  return walk(0, bytes.length, 'root');
}

const cache = new Map<string, string | null>();

/**
 * Extracts embedded cover art from a local audio file and returns it as a
 * `data:` URI React Native's `<Image>` can render directly, or `null` if the
 * file has no readable embedded artwork.
 */
export async function extractEmbeddedArtworkUri(fileUri: string, cacheKey: string): Promise<string | null> {
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const result = await (async () => {
    try {
      const file = new File(fileUri);
      const prefix = file.slice(0, PREFIX_BYTES);
      const buffer = await prefix.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const art = findId3ApicFrame(bytes) ?? findMp4CoverArt(bytes);
      if (!art) return null;
      return `data:${art.mimeType};base64,${bytesToBase64(art.bytes)}`;
    } catch {
      return null;
    }
  })();

  cache.set(cacheKey, result);
  return result;
}
