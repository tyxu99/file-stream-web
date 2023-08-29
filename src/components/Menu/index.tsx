import React, { useState } from "react";
import styles from "./index.module.scss";
import MENU from "@/constant/menu";
import { useRouter, usePathname } from "next/navigation";

const Index = () => {
  const router = useRouter();
  const pathname = usePathname();
  // console.log(pathname);
  const [current, setCurrent] = useState<string>(pathname);

  return (
    <div className={styles.menu}>
      {MENU.map((item, index) => (
        <div key={item.path}>
          <div
            className={styles.rootMenu}
            onClick={() => router.push(item.path)}
          >
            {item.name}
          </div>
          {item.routes && item.routes.length && (
            <div className={styles.subMenuWrapper} key={item.path + index}>
              {item.routes.map((d) => (
                <div className={styles.subMenu} key={d.path}>
                  {d.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Index;
