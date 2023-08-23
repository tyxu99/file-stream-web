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

  if (pathname.includes("h5")) {
    return <Component {...pageProps} />;
  }

  return ["/grid", "/svg-bezier", "/login"].includes(pathname) ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
