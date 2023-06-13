self.onmessage = (e) => {
  console.log("eeeeeeeee", e);
  const chunkSize = 1024 * 1024; // chunk 大小
  const totalBytes = e.data.size; // Blob 大小
  let startByte = 0;
  let endByte = 0;
  const chunks = [];

  // 将 Blob 切割成若干个 chunk
  while (startByte < totalBytes) {
    endByte = startByte + chunkSize;
    let slice = e.data.slice(startByte, endByte);
    chunks.push(slice);
    startByte = endByte;
  }

  // 将每个 chunk 映射为图像资源的 URL
  const urls = chunks.map((chunk) => URL.createObjectURL(chunk));

  // 发送结果到主线程
  postMessage(urls);
};
