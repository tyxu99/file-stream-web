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
  const [loading, setLoading] = useState(true);
  const [geoLocation, setGeoLocation] = useState({
    longitude: 31.2304,
    latitude: 121.4737,
  });

  useEffect(() => {
    if (navigator) {
      setLoading(false);
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { longitude, latitude } = coords;
          console.log(coords);
          setGeoLocation({ longitude, latitude });
        },
        (err) => {
          console.log("error", err);
        },
      );
    }
  }, []);

  return (
    <>
      {loading ? (
        <div>leaflet loading...</div>
      ) : (
        <DynamicMapContainer {...geoLocation} />
      )}
    </>
  );
};

export default Index;
