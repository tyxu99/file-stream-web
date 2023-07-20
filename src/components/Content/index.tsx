import React, { FC } from "react";
import styles from "./index.module.scss";

const Index = ({ children }: any) => {
  return <div className={styles.content}>{children}</div>;
};

export default Index;
