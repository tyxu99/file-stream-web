import md5 from "md5";

let count = 0;
export const generateFileId = async (file) => {
  // 每次截取多少二进制
  // let whileMax = Math.floor(
  //   file.size / 10 > 10240 * 1024 ? 10240 * 1024 : file.size / 10,
  // );
  let whileMax = 1024 * 1024;
  // 循环截取多少次
  let whileNumber =
    file.size <= 10240 * 1024 ? 10 : Math.ceil(file.size / whileMax);
  // 二进制的截取长度，超出10M后 每10M 截取一部分，最多10M
  let sliceEnd = Math.floor(
    ((((1024 * 10240) / file.size) * 100) / whileNumber) * whileMax,
  );
  sliceEnd = whileNumber > 10 ? sliceEnd : 10240 * 1024;
  // 转换二进制的长度
  let start = 0;
  let end = 0;

  let promiseArr = [];
  while (whileNumber--) {
    start = end;
    end = end + whileMax;
    let promiseArrayBuffer = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file.slice(start, end));
      reader.onload = () => {
        resolve(new Uint8Array(reader.result).slice(0, sliceEnd).join(""));
      };
    });
    promiseArr.push(promiseArrayBuffer);
  }
  const t = md5((await Promise.all(promiseArr)).join(""));
  return t + ("--" + ++count + "");
};
