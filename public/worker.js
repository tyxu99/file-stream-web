// import md5 from "md5";
//
// self.importScripts("");

self.onmessage = (e) => {
  const fr = new FileReader();
  fr.readAsArrayBuffer(e.data.file);
  fr.onload = () => {
    self.postMessage({ blob: fr.result, name: e.data.file.name });
  };

  // self.postMessage({ tag: generateFileId(e.data.file) });
};
