import React from "react";
import "../styles/globals.css";
import Layout from "@/components/Layout";

export default function App({
  Component,
  pageProps,
}: {
  Component: React.FC;
  pageProps: any;
}) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
