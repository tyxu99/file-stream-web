import React from "react";
import "../styles/globals.css";
import Layout from "@/components/Layout";
import { usePathname, useRouter } from "next/navigation";

export default function App({
  Component,
  pageProps,
}: {
  Component: React.FC;
  pageProps: any;
}) {
  const pathname = usePathname();
  console.log("_app", pathname);

  return ["/grid", "/svg-bezier"].includes(pathname) ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
