import "./MapBlock.css";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import SearchMarkers from "$component/info/MapBlock/Search/Search";
import { useLang } from "$component/Context/LangContext";
import Link from "next/link";
import { getData } from "api";

const MapBlock = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [markers, setMarkers] = useState([]);
  const { lang } = useLang();
  const mapRef = useRef(null);

  useEffect(() => {
    getData("markers", setMarkers);
  }, []);

  const customIcon = L.icon({
    iconUrl: "images/map/location.svg",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });

  const ZoomToPoint = ({ lat, lng }) => {
    const map = useMap();
    map.flyTo([lat, lng], 6);
    return null;
  };

  const handleZoom = (lat, lng) => {
    setSelectedPoint({ lat, lng });
  };

  // Ограничиваем границы карты на всю Землю
  const bounds = [
    [-130, -220], // юго-западная граница (весь мир)
    [130, 220],   // северо-восточная граница (весь мир)
  ];

  return (
    <div className="map">
      <div className="map__container">
        <h2 className="map__title _main-title">
          {lang === "ua" ? "Знайти нас на мапі" : "Find us on the map"}
        </h2>
        <SearchMarkers markers={markers} handleZoom={handleZoom} />
        <div className="map__body">
          {!mapRef.current && (
            <MapContainer
              center={[50.27, 30.31]}
              zoom={5}
              maxZoom={6}
              maxBounds={bounds} // Устанавливаем границы на весь мир
              maxBoundsViscosity={2} // Позволяем немного выходить за границы
              style={{ height: "100%", width: "100%", borderRadius: "5px" }}
              whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={[marker.lat, marker.lng]}
                  eventHandlers={{
                    click: () => setSelectedPoint({ lat: marker.lat, lng: marker.lng }),
                  }}
                  icon={customIcon}
                >
                  <Popup>
                    <h1 className="marker__title">{marker.title}</h1>
                    <div className="marker__number">
                      Зв'язатися з нами:
                      <br />
                      <Link href={marker.link ? marker.link : "#"}>
                        {marker.link ? marker.link : "Посилання відсутнє"}
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {selectedPoint && <ZoomToPoint lat={selectedPoint.lat} lng={selectedPoint.lng} />}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapBlock;