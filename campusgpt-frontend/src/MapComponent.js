// src/MapComponent.js
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayerGroup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

// --- ADD THIS CODE to merge the options ---
let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// --- DATA (Copied from your HTML, with your new locations) ---
const campusData = {
  locations: {
    "main gate": { name: "Main Gate", lat: 30.352076, lng: 76.373603 },
    "admin block": { name: "Admin Block", lat: 30.3527413, lng: 76.3715764 },
    library: { name: "Library", lat: 30.3542, lng: 76.369604 },
    cos: { name: "COS Block", lat: 30.353885, lng: 76.362715 },
    kravings: { name: "Kravings", lat: 30.35365, lng: 76.3671 },
    "main audi": { name: "Main Audi", lat: 30.351969, lng: 76.370851 },
    sbop: { name: "SBOP", lat: 30.3521337, lng: 76.36971 },
    "g-block": { name: "G-Block", lat: 30.353572, lng: 76.369987 },
    "hostel-j": { name: "Hostel J", lat: 30.352795, lng: 76.363819 },
    "hostel-h": { name: "Hostel H", lat: 30.353367, lng: 76.364479 },
    "sports-complex": {
      name: "Sports Complex",
      lat: 30.355579,
      lng: 76.364741,
    },
    "e-block": { name: "E-Block", lat: 30.3536386, lng: 76.37214 },
    "c-block": { name: "C-Block", lat: 30.353478, lng: 76.37017 },
    "f-block": { name: "F-Block", lat: 30.3539856, lng: 76.3717926 },
    "b-block": { name: "B-Block", lat: 30.352986, lng: 76.3705 },
    jaggi: { name: "Jaggi", lat: 30.352463, lng: 76.370902 },
    teslas: { name: "Teslas", lat: 30.3563891, lng: 76.3718625 },
    csed: { name: "CSED", lat: 30.35506, lng: 76.369721 },
    aahar: { name: "Aahar", lat: 30.353025, lng: 76.372281 },
    workshop: { name: "Workshop", lat: 30.354564, lng: 76.370959 },
    "tan-block": { name: "TAN", lat: 30.3537126, lng: 76.3683813 },
    nirvana: { name: "Nirvana", lat: 30.353778, lng: 76.367697 },
    "h canteen": { name: "H-Canteen", lat: 30.3523494, lng: 76.3623567 },
    "r and d gate": { name: "R and D Gate", lat: 30.355709, lng: 76.372866 },
    "hostel-a": { name: "Hostel A", lat: 30.35126, lng: 76.364674 },
    "hostel-pg": { name: "Hostel PG", lat: 30.35142, lng: 76.366791 },
    "hostel-n": { name: "Hostel N", lat: 30.354239, lng: 76.367761 },
    "hostel-e": { name: "Hostel E", lat: 30.354635, lng: 76.367255 },
    "hostel-g": { name: "Hostel G", lat: 30.354428, lng: 76.367186 },
    "hostel-i": { name: "Hostel I", lat: 30.354633, lng: 76.367314 },
    "hostel-q": { name: "Hostel Q", lat: 30.351484, lng: 76.36773 },
    "hostel-m": { name: "Hostel M", lat: 30.353092, lng: 76.361297 },
    "hostel-k": { name: "Hostel K", lat: 30.3568, lng: 76.36375 },
    "hostel-l": { name: "Hostel L", lat: 30.35707, lng: 76.36637 },
    "hostel-b": { name: "Hostel B", lat: 30.35121, lng: 76.363369 },
    "hostel-c": { name: "Hostel C", lat: 30.350864, lng: 76.361225 },
    "hostel-d": { name: "Hostel D", lat: 30.350774, lng: 76.360495 },
    "hostel-o": { name: "Hostel O", lat: 30.351089, lng: 76.362689 },
    dispensary: { name: "Dispensary", lat: 30.355888, lng: 76.368692 },
    "activity-space": { name: "Activity Space", lat: 30.3549, lng: 76.3695 },
    trifac: { name: "Trifac Core", lat: 30.35563, lng: 76.36771 },
  },
};

// --- Haversine & Graph Logic (Copied from your HTML) ---
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function buildGraph() {
  const graph = {};
  const locationKeys = Object.keys(campusData.locations);
  locationKeys.forEach((key) => {
    graph[key] = [];
  });
  for (let i = 0; i < locationKeys.length; i++) {
    for (let j = i + 1; j < locationKeys.length; j++) {
      const from = locationKeys[i];
      const to = locationKeys[j];
      const loc1 = campusData.locations[from];
      const loc2 = campusData.locations[to];
      const distance = haversineDistance(
        loc1.lat,
        loc1.lng,
        loc2.lat,
        loc2.lng
      );
      graph[from].push({ node: to, distance: distance });
      graph[to].push({ node: from, distance: distance });
    }
  }
  return graph;
}
const graph = buildGraph();
function findShortestPath(startKey, endKey) {
  const distances = {};
  const prev = {};
  const unvisited = new Set(Object.keys(campusData.locations));
  Object.keys(campusData.locations).forEach((key) => {
    distances[key] = Infinity;
    prev[key] = null;
  });
  distances[startKey] = 0;
  while (unvisited.size > 0) {
    let current = null;
    let minDist = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minDist) {
        minDist = distances[node];
        current = node;
      }
    }
    if (current === endKey || minDist === Infinity) break;
    unvisited.delete(current);
    graph[current].forEach(({ node: neighbor, distance }) => {
      if (unvisited.has(neighbor)) {
        const alt = distances[current] + distance;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          prev[neighbor] = current;
        }
      }
    });
  }
  const path = [];
  let current = endKey;
  while (current) {
    path.unshift(current);
    current = prev[current];
  }
  return { path, distance: distances[endKey] };
}

// --- Custom React Hook for Live Location ---
function LiveLocationMarker({ onLocationError }) {
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(0);
  const markerRef = useRef(null);
  const map = useMapEvents({});

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading: geoHeading } = pos.coords;
        const newPos = L.latLng(latitude, longitude);
        setPosition(newPos);
        setHeading(geoHeading !== null ? geoHeading : heading);
        if (map) {
          map.panTo(newPos, { animate: true, duration: 1 });
        }
      },
      (error) => {
        onLocationError(error);
        setPosition(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, onLocationError, heading]);

  useEffect(() => {
    if (markerRef.current && markerRef.current._icon) {
      markerRef.current._icon.style.transformOrigin = "center center";
      markerRef.current._icon.style.transform += ` rotate(${heading}deg)`;
    }
  }, [heading, position]);

  if (!position) return null;
  const liveIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" stroke="white" stroke-width="1"><path d="M12 2L4.5 20.5 12 17 19.5 20.5z"/></svg>`,
    className: "live-arrow-icon-container",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
  return <Marker ref={markerRef} position={position} icon={liveIcon} />;
}

// --- Tagging Mode Click Handler ---
function MapClickHandler({ isTagging, onMapClick }) {
  useMapEvents({
    click(e) {
      if (isTagging) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

// --- Main Map Component ---
const MapComponent = forwardRef(({ isVisible }, ref) => {
  const [startLoc, setStartLoc] = useState(
    Object.keys(campusData.locations)[0]
  );
  const [endLoc, setEndLoc] = useState(Object.keys(campusData.locations)[1]);
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [eta, setEta] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: null, isError: false });
  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [tagCoords, setTagCoords] = useState(null);
  const [displayCoords, setDisplayCoords] = useState(null);
  const mapInstanceRef = useRef();

  useEffect(() => {
    if (isVisible && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
        console.log("Map size invalidated.");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    setRouteGeoJson(null);
    setEta(null);
    if (isNavigating) {
      handleStopNavigation();
    }
  }, [startLoc, endLoc, isVisible]);

  const showMessage = (text, isError = true, duration = 4000) => {
    setMessage({ text, isError });
    const timer = setTimeout(
      () => setMessage({ text: null, isError: false }),
      duration
    );
    return () => clearTimeout(timer);
  };

  const handleGetDirections = async () => {
    if (isTaggingMode) toggleTaggingMode();
    if (startLoc === endLoc) {
      showMessage("Start and end locations must be different!");
      return;
    }
    setIsLoading(true);
    setRouteGeoJson(null);
    setEta(null);
    const result = findShortestPath(startLoc, endLoc);
    if (result.path.length > 1 && result.distance !== Infinity) {
      const coords = result.path
        .map(
          (key) =>
            `${campusData.locations[key].lng},${campusData.locations[key].lat}`
        )
        .join(";");
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`
        );
        if (!response.ok)
          throw new Error(`Routing service failed: ${response.statusText}`);
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRouteGeoJson(data.routes[0].geometry);
          const timeInMinutes = Math.ceil(result.distance / 1.4 / 60);
          setEta(`${timeInMinutes} min`);
          if (mapInstanceRef.current) {
            const geoJsonLayer = L.geoJSON(data.routes[0].geometry);
            mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds(), {
              padding: [30, 30],
            });
          }
        } else {
          throw new Error("No route found by OSRM");
        }
      } catch (error) {
        console.error("OSRM Error:", error);
        showMessage(`Could not retrieve route: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      showMessage("No valid path found between locations!");
      setIsLoading(false);
    }
  };

  const handleStartNavigation = () => {
    if (!navigator.geolocation) {
      showMessage("Geolocation is not supported.");
      return;
    }
    showMessage("Starting live navigation...", false);
    setIsNavigating(true);
  };
  const handleStopNavigation = () => {
    setIsNavigating(false);
  };
  const handleLocationError = (error) => {
    let msg = "Location error.";
    if (error.code === error.PERMISSION_DENIED) msg = "Location access denied.";
    else if (error.code === error.POSITION_UNAVAILABLE)
      msg = "Location unavailable.";
    else if (error.code === error.TIMEOUT) msg = "Location request timed out.";
    showMessage(msg);
    handleStopNavigation();
  };
  const handleMapClick = (latlng) => {
    setTagCoords(latlng);
    setDisplayCoords(
      `Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}`
    );
  };
  const toggleTaggingMode = () => {
    const nextTaggingState = !isTaggingMode;
    setIsTaggingMode(nextTaggingState);
    if (nextTaggingState) {
      showMessage("Tagging Mode ON: Click map.", false, 5000);
      setTagCoords(null);
      setDisplayCoords(null);
    } else {
      setDisplayCoords(null);
      setTagCoords(null);
    }
  };

  useImperativeHandle(ref, () => ({
    stopNavigation: handleStopNavigation,
  }));

  const locationOptions = Object.keys(campusData.locations)
    .sort()
    .map((key) => (
      <option key={key} value={key}>
        {campusData.locations[key].name}
      </option>
    ));

  return (
    <div className="map-component-container">
      <div className={`map-area ${isTaggingMode ? "tagging-mode" : ""}`}>
        <MapContainer
          center={[30.354, 76.368]}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => {
            mapInstanceRef.current = mapInstance;
          }}
          className={isTaggingMode ? "tagging-mode" : ""}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OSM"
          />
          <LayerGroup>
            {Object.entries(campusData.locations).map(([key, loc]) => (
              <Marker key={key} position={[loc.lat, loc.lng]}>
                {" "}
                <Popup>
                  <b>{loc.name}</b>
                </Popup>{" "}
              </Marker>
            ))}
          </LayerGroup>
          {routeGeoJson && (
            <GeoJSON
              key={JSON.stringify(routeGeoJson)}
              data={routeGeoJson}
              style={{ color: "#3B82F6", weight: 6, opacity: 0.8 }}
            />
          )}
          {isNavigating && (
            <LiveLocationMarker onLocationError={handleLocationError} />
          )}
          {isTaggingMode && tagCoords && (
            <Marker
              position={tagCoords}
              draggable={true}
              eventHandlers={{
                dragend: (e) => handleMapClick(e.target.getLatLng()),
              }}
            />
          )}
          <MapClickHandler
            isTagging={isTaggingMode}
            onMapClick={handleMapClick}
          />
        </MapContainer>
        {isLoading && (
          <div className="map-loading-overlay">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              {" "}
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>{" "}
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>{" "}
            </svg>
          </div>
        )}
      </div>
      <div className="map-controls-area">
        <div
          className={`message-box ${
            message.text ? "opacity-100" : "opacity-0"
          }`}
          style={{ color: message.isError ? "#F87171" : "#34D399" }}
        >
          {" "}
          {message.text || " "}{" "}
        </div>
        <div
          className={`coords-box ${
            displayCoords ? "opacity-100" : "opacity-0"
          }`}
        >
          {" "}
          {displayCoords || " "}{" "}
        </div>
        <div className="controls-grid">
          <div className="inputs-container">
            <div>
              {" "}
              <label htmlFor="start-location-map">Current Location</label>{" "}
              <select
                id="start-location-map"
                className="map-select"
                value={startLoc}
                onChange={(e) => setStartLoc(e.target.value)}
              >
                {" "}
                {locationOptions}{" "}
              </select>{" "}
            </div>
            <div>
              {" "}
              <label htmlFor="end-location-map">Destination</label>{" "}
              <select
                id="end-location-map"
                className="map-select"
                value={endLoc}
                onChange={(e) => setEndLoc(e.target.value)}
              >
                {" "}
                {locationOptions}{" "}
              </select>{" "}
            </div>
          </div>
          <div className="actions-container">
            <div className="eta-container">
              {" "}
              <p>Est. Time</p>{" "}
              <p className={`eta-time ${eta ? "" : "hidden"}`}>{eta}</p>{" "}
            </div>
            <button
              className={`tag-button ${isTaggingMode ? "active" : ""}`}
              onClick={toggleTaggingMode}
              title="Tag Location"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>{" "}
              </svg>
            </button>
            <div className="main-buttons">
              {!routeGeoJson && !isNavigating && (
                <button
                  className="map-button blue"
                  onClick={handleGetDirections}
                >
                  Directions
                </button>
              )}
              {routeGeoJson && !isNavigating && (
                <button
                  className="map-button green"
                  onClick={handleStartNavigation}
                >
                  Start Nav
                </button>
              )}
              {isNavigating && (
                <button
                  className="map-button red"
                  onClick={handleStopNavigation}
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MapComponent;
