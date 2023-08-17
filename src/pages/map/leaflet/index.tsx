import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicMapContainer = dynamic(
  () => import("@/components/MapComps/MapContainer"),
  {
    ssr: false,
    loading: () => <div>leafletjs loading...</div>,
  },
);

const Index = () => {
  return <DynamicMapContainer />;
};

export default Index;
