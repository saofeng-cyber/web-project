export function createChunk(file, index, chunkSize) {
  return new Promise((resolve) => {
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const reader = new FileReader();
    const blob = file.slice(start, end);
    reader.onload = (e) => {
      resolve({
        blob,
        index,
        start,
        end,
      });
    };
    reader.readAsArrayBuffer(blob);
  });
}
