import React, { useState } from "react";
import styles from "./index.module.scss";
import MENU from "@/constant/menu";
import { useRouter, usePathname } from "next/navigation";

const Index = () => {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const [current, setCurrent] = useState<string>(pathname);

  return (
    <div className={styles.menu}>
      {MENU.map((item, index) => (
        <>
          <div
            key={item.path}
            className={styles.rootMenu}
            style={{
              borderLeft: `${
                current.includes(item.path + "") ? 12 : 0
              }px solid skyblue`,
              background: current === item.path ? "#a7f3c5" : "transparent",
            }}
            onClick={() => {
              const path =
                item.routes && item.routes.length
                  ? item.routes[0].path
                  : item.path;
              setCurrent(path);
              current !== item.path && router.push(path);
            }}
          >
            {item.name}
          </div>
          <div
            key={index}
            className={styles.subMenuWrapper}
            style={{
              height:
                item.routes && current.includes(item.path)
                  ? item.routes.length * 38
                  : 0,
              borderLeft: `${
                current.includes(item.path) ? 12 : 0
              }px solid skyblue`,
            }}
          >
            {item.routes &&
              item.routes.length &&
              item.routes.map((d) => (
                <div
                  key={d.path}
                  className={styles.subMenu}
                  style={{
                    background: current === d.path ? "#a7f3c5" : "transparent",
                  }}
                  onClick={() => {
                    setCurrent(d.path);
                    current !== d.path && router.push(d.path);
                  }}
                >
                  {d.name}
                </div>
              ))}
          </div>
        </>
      ))}
    </div>
  );
};

export default Index;
