import { useEffect } from "react";
import { Button } from "antd";

const Index = () => {
  const keydown = [];
  useEffect(() => {
    if (document) {
      document.addEventListener("keydown", (e) => {
        if (!keydown.includes(e.key)) {
          console.log(e);
          keydown.push(e.key);
        }
      });

      document.addEventListener("keyup", (e) => {
        const index = keydown.indexOf(e.key);
        keydown.splice(index, 1);
      });

      // document.addEventListener("mouseup", (e) => {
      //   const selection: any = document.getSelection();
      //   const range = selection.getRangeAt(0);
      //   console.log("selection", selection);
      //   console.log("range", range);
      // });
    }
  }, []);

  const setSelection = () => {
    const selection = document.getSelection();
    const range = document.createRange();

    const el = document.querySelector("#selection");

    const nodes = getNodeAndOffset(el, 20, 150);
    range.setStart(nodes[0], nodes[1]);
    range.setEnd(nodes[2], nodes[3]);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const customFocus = () => {
    const selection = document.getSelection();
    const range = document.createRange();

    const el = document.querySelector("#selection");

    const nodes = getNodeAndOffset(el, 100, 100);
    range.setStart(nodes[0], nodes[1]);
    range.setEnd(nodes[2], nodes[3]);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const insertContent = () => {
    const el = document.querySelector("#selection");

    const range = document.getSelection().getRangeAt(0);
    const textNode = document.createTextNode("插入新内容");
    const spanNode = document.createElement("span");
    spanNode.textContent = "sssssspanNode";
    spanNode.style.background = "yellow";
    range.deleteContents();
    range.insertNode(spanNode);

    // range.setStartAfter(textNode);
    // el.focus();
  };

  const insertLabel = () => {
    // 选区有断层会报错 range.surroundContents(spanNode);
    const range = document.getSelection().getRangeAt(0);
    const spanNode = document.createElement("span");
    spanNode.style.background = "yellow";
    spanNode.append(range.extractContents());
    range.deleteContents();
    range.insertNode(spanNode);
    // range.surroundContents(spanNode);
  };

  const getRangeOffset = (wrap_dom) => {
    const txtList = [];
    const map = function (chlids) {
      [...chlids].forEach((el) => {
        if (el.nodeName === "#text") {
          txtList.push(el);
        } else {
          map(el.childNodes);
        }
      });
    };
    // 递归遍历，提取出所有 #text
    map(wrap_dom.childNodes);
    // 计算文本的位置区间 [0,3]、[3, 8]、[8,10]
    const clips = txtList.reduce((arr, item, index) => {
      const end =
        item.textContent.length + (arr[index - 1] ? arr[index - 1][2] : 0);
      arr.push([item, end - item.textContent.length, end]);
      return arr;
    }, []);
    const range = window.getSelection().getRangeAt(0);
    // 匹配选区与区间的#text，计算出整体偏移量
    const startOffset =
      clips.find((el) => range.startContainer === el[0])[1] + range.startOffset;
    const endOffset =
      clips.find((el) => range.endContainer === el[0])[1] + range.endOffset;
    return [startOffset, endOffset];
  };

  const getNodeAndOffset = (wrap_dom, start = 0, end = 0) => {
    const txtList = [];
    const map = function (chlids) {
      [...chlids].forEach((el) => {
        if (el.nodeName === "#text") {
          txtList.push(el);
        } else {
          map(el.childNodes);
        }
      });
    };
    // 递归遍历，提取出所有 #text
    map(wrap_dom.childNodes);
    // 计算文本的位置区间 [0,3]、[3, 8]、[8,10]
    const clips = txtList.reduce((arr, item, index) => {
      const end =
        item.textContent.length + (arr[index - 1] ? arr[index - 1][2] : 0);
      arr.push([item, end - item.textContent.length, end]);
      return arr;
    }, []);
    // 查找满足条件的范围区间
    const startNode = clips.find((el) => start >= el[1] && start < el[2]);
    const endNode = clips.find((el) => end >= el[1] && end < el[2]);
    return [startNode[0], start - startNode[1], endNode[0], end - endNode[1]];
  };

  return (
    <div>
      <div
        onClick={(e) => {
          console.log(e);
          const template = document.querySelector("#li-template");
          const els = new Set();
          if (template) {
            console.log(template.cloneNode(true));
            for (let i of [1, 2]) {
              const el = template.cloneNode(true);
              el.querySelector(".title").textContent = i ** i;
              el.querySelector(".pathname").textContent = i ** i + i;

              els.add(el);
            }
            document.querySelector("#container").append(...els);
          }
        }}
        style={{
          width: 100,
          height: 100,
          cursor: "pointer",
          border: "1px dashed",
        }}
        id="container"
      >
        P5
      </div>
      <template>
        <li id="li-template">
          <p className="title">Title</p>
          <p className="pathname">pathname</p>
        </li>
      </template>

      <div
        id="selection"
        style={{ background: "#fff", marginTop: 100 }}
        contentEditable="true"
      >
        选中区域背景色xuanzhongquyubei
        <span>jingse选中区域背景色xuanzhongquyubeiji</span>
        jingse选中区域背景色
        <span>jingse选中区域背景色xuanzhongquyubeiji</span>
        xuanzhongquyubeiji
        <span>
          jingse选中区域背景色x
          <span>jingse选中区域背景色xuanzhongquyubeiji</span> uanzhongquyubeiji
        </span>
        ngse选中区域背景色xuanzhongquyubeijingse选中区域背景色xuanzhongquyubeijingse选中区域背景色xuanzhongquyubeijingse选中区域背景色xuanzhongquyubeijingse选中区域背景色xuanzhongquyubeijingse选中区域背景色xuanzhongquyubeijingse选中区域背景色xuanzhongquyubeijingse选中区域背景色xuanzhongquyubeijingse
      </div>
      <Button onClick={setSelection}>选中</Button>
      <Button onClick={customFocus}>聚焦</Button>
      <Button onClick={insertContent}>插入</Button>
      <Button onClick={insertLabel}>标记</Button>
    </div>
  );
};

export default Index;
