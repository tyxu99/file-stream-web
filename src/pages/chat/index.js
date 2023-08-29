import openai from "openai";
import { useEffect } from "react";
import { Button } from "antd";
import CryptoJS from "crypto-js";

const Index = () => {
  const callTranslate = () => {
    fetch("/api/backend-test")
      .then((res) => res.json())
      .then((res) => {
        console.log("backend-res", res);
      });
  };

  return (
    <div>
      chat <Button onClick={callTranslate}>CallTranslate</Button>
    </div>
  );
};

export default Index;
