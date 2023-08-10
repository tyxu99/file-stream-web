import { captchaBase64 } from "@/asset/captchaBase64";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";

const Index = () => {
  const [isMouseDownSlider, setIsMouseDownSlider] = useState(false);
  const [initLeft, setInitLeft] = useState(-300);
  const [initClientX, setInitClientX] = useState(0);
  const [validSuccess, setValidSuccess] = useState(false);

  useEffect(() => {
    const imgEl = new Image();
    imgEl.src = captchaBase64;
    imgEl.onload = () => {
      if (document) {
        const baseCanvas: any = document.getElementById("baseCanvas");
        const captchaCanvas: any = document.getElementById("captchaCanvas");
        if (captchaCanvas && captchaCanvas.getContext) {
          const ctx = captchaCanvas.getContext("2d");

          ctx.beginPath();
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1;
          ctx.moveTo(400, 100);
          ctx.lineTo(300, 200);
          ctx.lineTo(350, 300);
          ctx.lineTo(450, 300);
          ctx.lineTo(500, 200);
          ctx.lineTo(400, 100);
          ctx.stroke();
          ctx.clip();
          ctx.drawImage(imgEl, 0, 0);

          const ctx2 = baseCanvas.getContext("2d");
          ctx2.drawImage(imgEl, 0, 0);
          ctx2.strokeStyle = "#fff";
          ctx2.lineWidth = 1;
          ctx2.beginPath();
          ctx2.moveTo(400, 100);
          ctx2.lineTo(300, 200);
          ctx2.lineTo(350, 300);
          ctx2.lineTo(450, 300);
          ctx2.lineTo(500, 200);
          ctx2.lineTo(400, 100);
          ctx2.stroke();
          ctx2.fillStyle = "rgba(255,165,0,1)";
        }
      }
    };
  }, []);

  useEffect(() => {
    if (document) {
      document.onmousemove = (e: any) => {
        if (isMouseDownSlider) {
          setElLeft(e.clientX);
        }
      };
      document.onmouseup = () => {
        setIsMouseDownSlider(false);
        if (validSuccess) {
          console.log("validSuccess");
        } else {
          setElLeft(0);
        }
      };
    }
    return () => {
      document.onmousemove = () => {};
      document.onmouseup = () => {};
    };
  }, [isMouseDownSlider, validSuccess]);

  const setElLeft = (val: number) => {
    const cEl: any = document.getElementById("captchaCanvas");
    const sEl: any = document.getElementById("imgSlider");
    let t = val - initClientX;
    if (t <= 0) t = 0;
    if (t >= 400) t = 400;
    cEl.style.left = t + initLeft + "px";
    sEl.style.left = t + "px";

    // 滑动验证成功
    if (t + initLeft <= 5 && t + initLeft >= -5) {
      setValidSuccess(true);
    } else {
      setValidSuccess(false);
    }
  };

  const mouseDownSlider = (e: any) => {
    setIsMouseDownSlider(true);
    setInitClientX(e.clientX);
  };

  return (
    <div className={styles.captchaWrapper}>
      <canvas
        className={styles.baseImage}
        id="baseCanvas"
        width="600"
        height="400"
      ></canvas>
      <canvas
        style={{ left: -300 }}
        className={styles.slideImage}
        id="captchaCanvas"
        width="600"
        height="400"
      ></canvas>
      <div className={styles.slideBlock}>
        <div
          onMouseDown={mouseDownSlider}
          className={styles.slider}
          id="imgSlider"
        ></div>
      </div>
    </div>
  );
};

export default Index;
