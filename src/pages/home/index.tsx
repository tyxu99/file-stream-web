import GenerateFileId from "@/components/generateFileId";
import Upload from "@/components/upload";
import { Observable } from "rxjs";
// import NativeDrag from "@/components/NativeDrag";
import SvgClip from "@/components/SvgClip";
import * as XLSX from "xlsx";

const Home = () => {
  const onRxObservable = () => {
    const observable = new Observable((subscriber) => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);
      setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
      }, 1000);
    });

    console.log("before subscribe");

    observable.subscribe({
      next(x) {
        console.log("get value", x);
      },
      error(err) {
        console.log("sth wrong", err);
      },
      complete() {
        console.log("done");
      },
    });

    console.log("after subscribe");
  };

  const data = new Array(5).fill({
    name: 1,
    age: 12,
    sex: 1,
    addr: "asdfasd",
    fate: "dead",
    now: new Date(),
    drink: "wine",
  });

  const jsonToExcel = () => {
    const t = data.map((d) => ({
      ...d,
      name: d.name + 1,
      sex: d.sex === 1 ? "男" : "女",
      fate: d.fate === "dead" ? "死亡" : "未知",
      now: d.now.toISOString(),
    }));
    const sheet = XLSX.utils.json_to_sheet(t);
    // ["A1", "B1", "C1", "D1", "E1", "F1", "G1"].forEach((d) => {
    //   sheet[d]["v"] = obj[sheet[d]["v"]];
    // });

    sheet["!cols"] = Object.values(t[0]).map((d) => ({
      wch: (d + "").length + 5,
    }));
    XLSX.utils.sheet_add_aoa(
      sheet,
      [["姓名", "年龄", "性别", "地址", "命运", "当前时间", "饮料"]],
      { origin: "A1" },
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "sheet1");
    XLSX.writeFile(workbook, "test.xlsx");
  };

  return (
    <>
      <div onClick={onRxObservable}>Observable</div>
      <GenerateFileId />
      <Upload />
      {/*<NativeDrag />*/}
      {/*<Captcha />*/}
      <SvgClip />
    </>
  );
};

export default Home;
