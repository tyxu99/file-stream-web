// import md5 from "md5";
//
// self.importScripts("");

self.onmessage = (e) => {
  const fr = new FileReader();
  fr.readAsDataURL(e.data.file);
  fr.onload = () => {
    self.postMessage(fr.result);
  };

  // self.postMessage({ tag: generateFileId(e.data.file) });
};
