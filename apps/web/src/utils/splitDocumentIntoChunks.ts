export function splitDocumentIntoChunks(
  text: string,
  chunkSize: number,
  chunkOverlap: number,
) {
  const tokens = Array.from(text);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const token of tokens) {
    if (currentChunk.length + token.length <= chunkSize) {
      currentChunk += token;
    } else {
      chunks.push(currentChunk);
      currentChunk =
        currentChunk.slice(
          currentChunk.length - chunkOverlap,
          currentChunk.length,
        ) + token;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}
