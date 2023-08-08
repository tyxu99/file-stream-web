import styles from "./index.module.scss";
import Image from "next/image";
import { Form, Input, Button } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import CaptchaImg from "@/asset/captchaImg.jpeg";

const Item = Form.Item;

const InputForm = ({
  option,
  tipClickHandler,
}: {
  option: "login" | "signup";
  tipClickHandler: () => void;
}) => {
  const [form] = Form.useForm();
  const flag = option === "login";
  return (
    <div className={styles.inputForm}>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form}>
        <Item label="用户名：" name="username">
          <Input placeholder="用户名" type="username" />
        </Item>
        <Item label="密码：" name="password">
          <Input placeholder="密码" type="password" />
        </Item>
        <Item label="验证码：" name="validateCode">
          <Input placeholder="验证码"></Input>
        </Item>
        <div className={styles.noAccount}>
          <a onClick={tipClickHandler}>
            {!flag ? "Log In" : "Sign Up"} &gt;&gt;&gt;
          </a>
        </div>
      </Form>
      <Button type="primary">{flag ? "登录" : "注册"}</Button>
    </div>
  );
};

const Index = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [option, setOption] = useState("login");
  console.log(pathname);

  const isLogin = option === "login";

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div
          className={styles.login}
          style={{ transform: `rotateY(${isLogin ? 0 : 180}deg)` }}
        >
          <InputForm
            option="login"
            tipClickHandler={() => setOption("signup")}
          />
        </div>
        <div
          className={styles.signup}
          style={{ transform: `rotateY(${isLogin ? -180 : 0}deg)` }}
        >
          <InputForm
            option="signup"
            tipClickHandler={() => setOption("login")}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
