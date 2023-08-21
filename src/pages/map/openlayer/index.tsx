import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { useEffect, useState } from "react";
import { Button } from "antd";

const Index = () => {
  const [mapInst, setMapInst] = useState<any>(null);
  useEffect(() => {
    if (document) {
      const map = new Map({
        target: "openlayerMap",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [30.595099, 114.299932],
          zoom: 10,
        }),
      });
      setMapInst(map);
    }
  }, []);

  const adjustZoom = (type: string) => {
    if (!mapInst) return;
    const view = mapInst.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom + { in: -1, out: 1 }[type]);
  };

  return (
    <>
      <div style={{ height: "80%" }} id="openlayerMap"></div>
      <Button type="primary" onClick={() => adjustZoom("in")}>
        zoom in
      </Button>
      <Button type="primary" onClick={() => adjustZoom("out")}>
        zoom out
      </Button>
    </>
  );
};

export default Index;
