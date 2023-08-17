import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import WSPath from "@/constant/navigationPath";

const Index = ({ longitude, latitude }: any) => {
  useEffect(() => {
    // if (navigator) {
    //   navigator.geolocation.getCurrentPosition(
    //     ({ coords }) => {
    //       const { latitude, longitude } = coords;
    //       console.log(latitude, longitude);
    //       initMap(latitude, longitude);
    //     },
    //     (err) => {
    //       console.log("getGeoError", err);
    //       initMap(latitude, longitude);
    //     },
    //   );
    // }

    const colors: any = {
      "0": "red",
      "1": "green",
    };
    const pathObj: any = {
      "0": [],
      "1": [],
    };
    WSPath.forEach((item, index) => {
      item.steps.forEach((d) => {
        pathObj[index + ""].push(d.maneuver.location.reverse());
      });
    });

    const map = L.map("leafletBox").setView([30.595099, 114.299932], 10);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "",
    }).addTo(map);
    Object.values(pathObj).forEach((d: any, i) => {
      d.forEach((latlng: any) => {
        console.log(latlng);
        const marker = L.marker(latlng, {
          icon: L.icon({
            iconUrl: "/mapMarker.png",
            iconSize: [24, 24],
          }),
        }).addTo(map);

        marker
          .bindPopup(latlng[0].toFixed(2) + " " + latlng[1].toFixed(2))
          .openPopup();

        // L.popup()
        //   .setLatLng(latlng)
        //   .setContent(latlng[0].toFixed(2) + " " + latlng[1].toFixed(2))
        //   .openOn(map);
      });
      L.polyline(d, { color: colors[i + ""] }).addTo(map);
    });
  }, []);

  const initMap = (latitude: number, longitude: number) => {
    const map = L.map("leafletBox").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "",
    }).addTo(map);
    // const marker = L.marker([latitude, longitude], {
    //   icon: L.icon({
    //     iconUrl: "/mapMarker.png",
    //     iconSize: [30, 30],
    //   }),
    //   draggable: true,
    // }).addTo(map);
    // const circle = L.circle([latitude, longitude], {
    //   color: "red",
    //   fillColor: "#f03",
    //   fillOpacity: 0.5,
    //   radius: 3000,
    // }).addTo(map);
    // const polygon = L.polygon([
    //   [latitude + 0.04, longitude - 0.04],
    //   [latitude + 0.04, longitude + 0.04],
    //   [latitude - 0.04, longitude],
    // ]).addTo(map);

    // const popup = L.popup()
    //   .setLatLng([latitude, longitude])
    //   .setContent("abcdefg")
    //   .openOn(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      L.popup()
        .setLatLng([lat, lng])
        .setContent("经纬度：" + lat.toFixed(4) + " " + lng.toFixed(4))
        .openOn(map);
    });

    // marker.bindPopup("marker");
    // circle.bindPopup("circle");
    // polygon.bindPopup("polygon");

    // L.polyline(
    //   [
    //     [latitude + 0.05, longitude - 0.05],
    //     [latitude + 0.05, longitude + 0.05],
    //     [latitude - 0.05, longitude],
    //   ],
    //   {
    //     color: "green",
    //   },
    // ).addTo(map);
  };

  return <div id="leafletBox" style={{ height: "100%" }}></div>;
};

export default Index;
