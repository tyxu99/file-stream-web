import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PositionTag from "@/asset/CharmTreeFir.svg";

const Index = ({ longitude, latitude }: any) => {
  console.log("mapContainer", longitude, latitude);
  return (
    <MapContainer
      center={[longitude, latitude]}
      zoom={13}
      // scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[longitude, latitude]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Index;
