import "./MapBlock.css";
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import SearchMarkers from "$component/info/MapBlock/Search/Search";
import { useLang } from "$component/Context/LangContext";
import Link from "next/link";
import { getData } from "api";
import Image from "next/image";
import SidebarSearch from '$component/info/MapBlock/SidebarSearch/SidebarSearch';

const PassMapToSidebar = ({ markers, handleZoom }) => {
	const map = useMap();
	return (
		<SidebarSearch
			markers={markers}
			handleZoom={handleZoom}
			disableMapInteraction={() => map.dragging.disable()}
			enableMapInteraction={() => map.dragging.enable()}
		/>
	);
};

const MapBlock = () => {
	const [selectedPoint, setSelectedPoint] = useState(null);
	const [markers, setMarkers] = useState([]);
	const { lang } = useLang();

	useEffect(() => {
		getData("markers", setMarkers)
	}, [])

	const customIcon = L.icon({
		iconUrl: 'images/map/location.svg',
		iconSize: [48, 48],
		iconAnchor: [24, 48],
		popupAnchor: [0, -48],
	});

	const ZoomToPoint = ({ lat, lng }) => {
		const map = useMap();
		map.flyTo([lat, lng], 7);
		return null;
	};

	const handleZoom = (lat, lng) => {
		setSelectedPoint({ lat, lng });
	};

	const truncateText = (text, maxLength) => {
		return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
	};

	return (
		<div className="map">
			<div className="map__container">
				<h2 className="map__title _main-title">
					{lang === 'ua' ? "Географія Швейної роти" : "Geography of Shveyna Rota"}
				</h2>
				<div className="map_line"></div>
				<div className="map__body">
					<MapContainer
						center={[50.27, 30.31]}
						zoom={5}
						maxZoom={7}
						style={{
							height: '100%',
							width: '100%',
							borderRadius: "5px",
							position: 'relative'
						}}
					>
						<TileLayer
							url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
							attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
						/>

						{markers.map(marker => (
							<Marker
								key={marker.id}
								position={[marker.lat, marker.lng]}
								eventHandlers={{
									click: (e) => {
										e.target.openPopup(); // відкриває попап
										setSelectedPoint({ lat: marker.lat, lng: marker.lng });
									}
								}}
								icon={customIcon}
							>
								<Popup>
									<div className="marker">
										<div className="marker__logo">
											<Image
												src={'http://drive.google.com/uc?export=view&id=' + marker.path}
												height={105}
												width={105}
												alt="icon"
											/>
										</div>
										<div className="marker__body">
											<h3 className="marker__title">{marker.title}</h3>
											<div className="marker__number">
												Зв'язатися з нами:<br />
												<Link href={marker.link ? marker.link : "#"}>
													{marker.link ? truncateText(marker.link, 40) : "Посилання відсутнє"}
												</Link>
											</div>
										</div>
									</div>
								</Popup>
							</Marker>
						))}

						{/* Zoom */}
						{selectedPoint && <ZoomToPoint lat={selectedPoint.lat + 3} lng={selectedPoint.lng} />}

						{/* Sidebar */}
						<PassMapToSidebar markers={markers} handleZoom={handleZoom} />
					</MapContainer>
				</div>
			</div>
		</div>
	);
};

export default MapBlock;
