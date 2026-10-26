function concat(parts: Uint8Array[]) {
  const result = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0; for (const part of parts) { result.set(part, offset); offset += part.length; }
  return result;
}

export function sanitizeImage(input: ArrayBuffer, type: string) {
  const bytes = new Uint8Array(input);
  if (type === "image/jpeg") {
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error("invalid-image");
    const parts = [bytes.slice(0, 2)]; let offset = 2;
    while (offset + 4 <= bytes.length && bytes[offset] === 0xff) {
      const marker = bytes[offset + 1];
      if (marker === 0xda) { parts.push(bytes.slice(offset)); return concat(parts).buffer; }
      const length = (bytes[offset + 2] << 8) + bytes[offset + 3];
      if (length < 2 || offset + 2 + length > bytes.length) throw new Error("invalid-image");
      if (marker !== 0xe1 && marker !== 0xed && marker !== 0xfe) parts.push(bytes.slice(offset, offset + 2 + length));
      offset += 2 + length;
    }
    throw new Error("invalid-image");
  }
  if (type === "image/png") {
    if (!(bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)) throw new Error("invalid-image");
    const parts = [bytes.slice(0, 8)]; let offset = 8;
    const removable = new Set(["eXIf", "tEXt", "zTXt", "iTXt"]);
    while (offset + 12 <= bytes.length) {
      const length = new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0);
      const end = offset + 12 + length;
      if (end > bytes.length) throw new Error("invalid-image");
      const name = String.fromCharCode(...bytes.slice(offset + 4, offset + 8));
      if (!removable.has(name)) parts.push(bytes.slice(offset, end));
      offset = end; if (name === "IEND") return concat(parts).buffer;
    }
    throw new Error("invalid-image");
  }
  if (type === "image/webp") {
    const header = new TextDecoder("latin1").decode(bytes.slice(0, 12));
    if (!header.startsWith("RIFF") || !header.endsWith("WEBP")) throw new Error("invalid-image");
    if (new TextDecoder("latin1").decode(bytes).includes("EXIF")) throw new Error("metadata-not-supported");
    return input;
  }
  throw new Error("invalid-image");
}
