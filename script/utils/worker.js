import { createChunk } from "./createChunk.js";

self.addEventListener("message", async (event) => {
  const result = [];
  const { file, start, end, CHUNK_SIZE } = event.data;
  for (let i = start; i < end; i++) {
    const prom = createChunk(file, i, CHUNK_SIZE);
    result.push(prom);
  }
  const chunks = await Promise.all(result);

  self.postMessage(chunks);
});
