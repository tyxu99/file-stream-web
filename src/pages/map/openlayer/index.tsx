import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { useEffect, useState } from "react";
import { Button } from "antd";
import "./index.module.scss";
import { Control, defaults as defaultControls } from "ol/control";

class RotateNorthControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};
    const button = document.createElement("button");
    button.innerHTML = "N";

    const element = document.createElement("div");
    element.className = "rotate-north ol-unselectable - ol-control";
    element.appendChild(button);

    super({
      element,
      target: options.target,
    });
  }

  handleRotateNorth() {
    this.getMap().getView().setRotation(0);
  }
}

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
          center: [0, 0],
          zoom: 1,
        }),
        // controls: defaultControls().extend([new RotateNorthControl()]),
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
