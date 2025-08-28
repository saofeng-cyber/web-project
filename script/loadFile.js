const inputFile = document.querySelector("input[type=file]");
const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB
const THREAD_COUNT = navigator.hardwareConcurrency || 4;

const cutFile = (file) => {
  return new Promise((resolve) => {
    const chunks = Math.ceil(file.size / CHUNK_SIZE);
    const threadFileCount = Math.ceil(chunks / THREAD_COUNT);
    const result = [];

    let doneCount = 0;
    let activeThreads = 0;
    for (let i = 0; i < THREAD_COUNT; i++) {
      const start = i * threadFileCount;
      const end = Math.min(start + threadFileCount, chunks);
      if (end - start === 0) break;
      const worker = new Worker(new URL("./utils/worker.js", import.meta.url), {
        type: "module",
      });
      activeThreads++;
      worker.postMessage({
        file: file,
        start,
        end,
        CHUNK_SIZE,
      });
      worker.onmessage = (e) => {
        worker.terminate();
        result[i] = e.data;
        doneCount++;
        if (doneCount === activeThreads) {
          resolve(result.flat());
        }
      };
    }
  });
};
inputFile.onchange = async function (e) {
  if (e.target.files.length === 0) return;
  const file = e.target.files[0];
  const chunks = await cutFile(file);
  console.log(chunks);
};
