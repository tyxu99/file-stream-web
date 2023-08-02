import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./card";
import styles from "./index.module.scss";

const CardSort = () => {
  const [cardList, setCardList] = useState([
    {
      id: 0,
      text: "000",
    },
    {
      id: 1,
      text: "111",
    },
    {
      id: 2,
      text: "222",
    },
    {
      id: 3,
      text: "333",
    },
    {
      id: 4,
      text: "444",
    },
  ]);

  const [cardListR, setCardListR] = useState([
    {
      id: 5,
      text: "555",
    },
    {
      id: 6,
      text: "666",
    },
    {
      id: 7,
      text: "777",
    },
    {
      id: 8,
      text: "888",
    },
    {
      id: 9,
      text: "999",
    },
  ]);

  const changePosition = (
    dragIndex: string | number,
    hoverIndex: string | number,
  ) => {
    let data: any = cardList.slice();
    let temp = data[dragIndex];
    // 交换位置
    data[dragIndex] = data[hoverIndex];
    data[hoverIndex] = temp;
    setCardList(data);
  };

  const changePositionR = (
    dragIndex: string | number,
    hoverIndex: string | number,
  ) => {
    let data: any = cardListR.slice();
    let temp = data[dragIndex];
    // 交换位置
    data[dragIndex] = data[hoverIndex];
    data[hoverIndex] = temp;
    setCardListR(data);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles["card-container"]}>
        <div className={styles["card_drag_group"]}>
          {cardList.map((each: any, index: any) => (
            <Card
              changePosition={changePosition}
              index={"l" + index}
              id={each.id}
              text={each.text}
              key={"drag_card" + index + each.text}
            />
          ))}
        </div>
        <div style={{ flex: 4 }}></div>
        <div className={styles["card_drag_group"]}>
          {cardListR.map((each: any, index: any) => (
            <Card
              changePosition={changePositionR}
              index={"r" + index}
              id={each.id}
              text={each.text}
              key={"drag_card" + index + each.text}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default CardSort;
