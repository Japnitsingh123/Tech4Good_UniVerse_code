// src/MapComponent.js
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  GeoJSON,
  LayerGroup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapComponent.css";
import {
  FaDirections,
  FaPlay,
  FaStop,
  FaMapPin,
} from "react-icons/fa";

// Fix Leaflet's default icon URLs for Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom category icons with glow and clear sizing
const createCustomMarker = (color = "#6366F1") => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.6);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
};

const campusData = {
  locations: {
    "main gate": { name: "Main Gate", lat: 30.352076, lng: 76.373603, category: "Gates" },
    "admin block": { name: "Admin Block", lat: 30.3527413, lng: 76.3715764, category: "Academic" },
    library: { name: "Central Library", lat: 30.3542, lng: 76.369604, category: "Academic" },
    cos: { name: "COS Block", lat: 30.353885, lng: 76.362715, category: "Academic" },
    kravings: { name: "Kravings Cafe", lat: 30.35365, lng: 76.3671, category: "Food" },
    "main audi": { name: "Main Auditorium", lat: 30.351969, lng: 76.370851, category: "Facilities" },
    sbop: { name: "SBOP Bank / ATM", lat: 30.3521337, lng: 76.36971, category: "Facilities" },
    "g-block": { name: "G-Block", lat: 30.353572, lng: 76.369987, category: "Academic" },
    "hostel-j": { name: "Hostel J", lat: 30.352795, lng: 76.363819, category: "Hostels" },
    "hostel-h": { name: "Hostel H", lat: 30.353367, lng: 76.364479, category: "Hostels" },
    "sports-complex": { name: "Sports Complex", lat: 30.355579, lng: 76.364741, category: "Facilities" },
    "e-block": { name: "E-Block", lat: 30.3536386, lng: 76.37214, category: "Academic" },
    "c-block": { name: "C-Block", lat: 30.353478, lng: 76.37017, category: "Academic" },
    "f-block": { name: "F-Block", lat: 30.3539856, lng: 76.3717926, category: "Academic" },
    "b-block": { name: "B-Block", lat: 30.352986, lng: 76.3705, category: "Academic" },
    jaggi: { name: "Jaggi Eatery", lat: 30.352463, lng: 76.370902, category: "Food" },
    teslas: { name: "Teslas Lab", lat: 30.3563891, lng: 76.3718625, category: "Academic" },
    csed: { name: "CSED (Computer Science)", lat: 30.35506, lng: 76.369721, category: "Academic" },
    aahar: { name: "Aahar Canteen", lat: 30.353025, lng: 76.372281, category: "Food" },
    workshop: { name: "Mechanical Workshop", lat: 30.354564, lng: 76.370959, category: "Academic" },
    "tan-block": { name: "TAN Block", lat: 30.3537126, lng: 76.3683813, category: "Academic" },
    nirvana: { name: "Nirvana Food Court", lat: 30.353778, lng: 76.367697, category: "Food" },
    "h canteen": { name: "H-Canteen", lat: 30.3523494, lng: 76.3623567, category: "Food" },
    "r and d gate": { name: "R&D Gate", lat: 30.355709, lng: 76.372866, category: "Gates" },
    "hostel-a": { name: "Hostel A", lat: 30.35126, lng: 76.364674, category: "Hostels" },
    "hostel-b": { name: "Hostel B", lat: 30.35121, lng: 76.363369, category: "Hostels" },
    "hostel-c": { name: "Hostel C", lat: 30.350864, lng: 76.361225, category: "Hostels" },
    "hostel-d": { name: "Hostel D", lat: 30.350774, lng: 76.360495, category: "Hostels" },
    "hostel-e": { name: "Hostel E", lat: 30.354635, lng: 76.367255, category: "Hostels" },
    "hostel-g": { name: "Hostel G", lat: 30.354428, lng: 76.367186, category: "Hostels" },
    "hostel-k": { name: "Hostel K", lat: 30.3568, lng: 76.36375, category: "Hostels" },
    "hostel-l": { name: "Hostel L", lat: 30.35707, lng: 76.36637, category: "Hostels" },
    "hostel-m": { name: "Hostel M", lat: 30.353092, lng: 76.361297, category: "Hostels" },
    "hostel-n": { name: "Hostel N", lat: 30.354239, lng: 76.367761, category: "Hostels" },
    "hostel-o": { name: "Hostel O", lat: 30.351089, lng: 76.362689, category: "Hostels" },
    "hostel-q": { name: "Hostel Q", lat: 30.351484, lng: 76.36773, category: "Hostels" },
    dispensary: { name: "University Dispensary", lat: 30.355888, lng: 76.368692, category: "Facilities" },
    "activity-space": { name: "Activity Space", lat: 30.3549, lng: 76.3695, category: "Facilities" },
    trifac: { name: "Trifac Core", lat: 30.35563, lng: 76.36771, category: "Facilities" },
  },
};

// Distance calculation
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

// React-Leaflet helper to manage viewport, resizing, and route bounds
function MapController({ isVisible, routeGeoJson, selectedCategory }) {
  const map = useMap();

  useEffect(() => {
    if (isVisible && map) {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible, map]);

  useEffect(() => {
    if (routeGeoJson && map) {
      try {
        const layer = L.geoJSON(routeGeoJson);
        map.fitBounds(layer.getBounds(), { padding: [50, 50], maxZoom: 18 });
      } catch (e) {
        console.error("FitBounds error:", e);
      }
    }
  }, [routeGeoJson, map]);

  return null;
}

// Live GPS Location
function LiveLocationMarker({ onLocationError }) {
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(0);
  const markerRef = useRef(null);
  const map = useMapEvents({});

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading: geoHeading } = pos.coords;
        const newPos = L.latLng(latitude, longitude);
        setPosition(newPos);
        if (geoHeading !== null && geoHeading !== undefined) {
          setHeading(geoHeading);
        }
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
  }, [map, onLocationError]);

  if (!position) return null;
  const liveIcon = L.divIcon({
    html: `<div style="transform: rotate(${heading}deg); display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#06B6D4" stroke="white" stroke-width="1.5"><path d="M12 2L4.5 20.5 12 17 19.5 20.5z"/></svg>
    </div>`,
    className: "live-arrow-icon-container",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  return <Marker ref={markerRef} position={position} icon={liveIcon} />;
}

// Tagging Handler
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

const MapComponent = forwardRef(({ isVisible }, ref) => {
  const [startLoc, setStartLoc] = useState("main gate");
  const [endLoc, setEndLoc] = useState("library");
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [eta, setEta] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: null, isError: false });
  const [isTaggingMode, setIsTaggingMode] = useState(false);
  const [tagCoords, setTagCoords] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const showMessage = useCallback((text, isError = true, duration = 4000) => {
    setMessage({ text, isError });
    const timer = setTimeout(() => setMessage({ text: null, isError: false }), duration);
    return () => clearTimeout(timer);
  }, []);

  const handleStopNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  useEffect(() => {
    setRouteGeoJson(null);
    setEta(null);
    if (isNavigating) {
      handleStopNavigation();
    }
  }, [startLoc, endLoc, isVisible, isNavigating, handleStopNavigation]);

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
        if (!response.ok) {
          throw new Error(`Routing service response: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRouteGeoJson(data.routes[0].geometry);
          const timeInMinutes = Math.max(1, Math.ceil(result.distance / 1.4 / 60));
          setEta(`${timeInMinutes} min walk (${Math.round(result.distance)}m)`);
          showMessage("Route calculated successfully!", false, 3000);
        } else {
          throw new Error("No route found by OSRM");
        }
      } catch (error) {
        console.warn("OSRM direct fallback, using straight path:", error);
        const fallbackGeoJson = {
          type: "LineString",
          coordinates: result.path.map((k) => [
            campusData.locations[k].lng,
            campusData.locations[k].lat,
          ]),
        };
        setRouteGeoJson(fallbackGeoJson);
        const timeInMinutes = Math.max(1, Math.ceil(result.distance / 1.4 / 60));
        setEta(`~${timeInMinutes} min walk`);
        showMessage("Showing estimated direct pathway.", false, 3000);
      } finally {
        setIsLoading(false);
      }
    } else {
      showMessage("No valid path found between selected spots.");
      setIsLoading(false);
    }
  };

  const handleStartNavigation = () => {
    if (!navigator.geolocation) {
      showMessage("Geolocation is not supported in this browser.");
      return;
    }
    showMessage("Live navigation started. Follow the cyan marker.", false);
    setIsNavigating(true);
  };

  const handleLocationError = (error) => {
    let msg = "Location error.";
    if (error.code === error.PERMISSION_DENIED) msg = "Location permission denied.";
    else if (error.code === error.POSITION_UNAVAILABLE) msg = "Location unavailable.";
    else if (error.code === error.TIMEOUT) msg = "Location request timed out.";
    showMessage(msg);
    handleStopNavigation();
  };

  const handleMapClick = (latlng) => {
    setTagCoords(latlng);
    showMessage(`Tagged: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`, false, 3000);
  };

  const toggleTaggingMode = () => {
    const nextState = !isTaggingMode;
    setIsTaggingMode(nextState);
    if (nextState) {
      showMessage("Tagging Mode ON: Click anywhere on map to pin coordinates.", false, 4000);
      setTagCoords(null);
    } else {
      setTagCoords(null);
    }
  };

  useImperativeHandle(ref, () => ({
    stopNavigation: handleStopNavigation,
  }));

  const locationEntries = Object.entries(campusData.locations);
  const filteredMarkers = locationEntries.filter(([_, loc]) => {
    if (selectedCategory === "All") return true;
    return loc.category === selectedCategory;
  });

  // Group locations by category for clean organized dropdown
  const categoriesList = ["Academic", "Hostels", "Food", "Facilities", "Gates"];
  const groupedLocations = categoriesList.map((cat) => ({
    category: cat,
    items: locationEntries
      .filter(([_, loc]) => loc.category === cat)
      .sort((a, b) => a[1].name.localeCompare(b[1].name)),
  }));

  const renderDropdownOptions = () => (
    <>
      {groupedLocations.map((group) => (
        <optgroup key={group.category} label={`── ${group.category} ──`}>
          {group.items.map(([key, loc]) => (
            <option key={key} value={key}>
              {loc.name}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );

  return (
    <div className="map-component-container">
      {/* 1. Floating Top Controls */}
      <div className="map-floating-controls">
        <div className="map-search-card">
          <div className="map-control-group">
            <label>Start Location</label>
            <select
              className="map-select"
              value={startLoc}
              onChange={(e) => setStartLoc(e.target.value)}
            >
              {renderDropdownOptions()}
            </select>
          </div>

          <div className="map-control-group">
            <label>Destination</label>
            <select
              className="map-select"
              value={endLoc}
              onChange={(e) => setEndLoc(e.target.value)}
            >
              {renderDropdownOptions()}
            </select>
          </div>

          <div className="map-actions-group">
            {!routeGeoJson && !isNavigating && (
              <button
                className="map-btn primary"
                onClick={handleGetDirections}
                disabled={isLoading}
              >
                <FaDirections /> {isLoading ? "Routing..." : "Directions"}
              </button>
            )}
            {routeGeoJson && !isNavigating && (
              <button className="map-btn success" onClick={handleStartNavigation}>
                <FaPlay size={11} /> Start Nav
              </button>
            )}
            {isNavigating && (
              <button className="map-btn danger" onClick={handleStopNavigation}>
                <FaStop size={11} /> Stop Nav
              </button>
            )}
            <button
              className={`map-btn icon-only ${isTaggingMode ? "active" : ""}`}
              onClick={toggleTaggingMode}
              title="Pin Custom Location"
            >
              <FaMapPin />
            </button>
          </div>
        </div>

        {eta && (
          <div className="map-status-pill">
            <div>
              <span className="eta-label">Est. Walk Time</span>
              <div className="eta-highlight">{eta}</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Toast Notification */}
      {message.text && (
        <div className={`map-toast-msg ${message.isError ? "error" : "success"}`}>
          {message.text}
        </div>
      )}

      {/* 3. Map Viewport */}
      <div className="map-area">
        <MapContainer
          center={[30.354, 76.368]}
          zoom={16}
          minZoom={14}
          maxZoom={19}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            isVisible={isVisible}
            routeGeoJson={routeGeoJson}
            selectedCategory={selectedCategory}
          />

          <LayerGroup>
            {filteredMarkers.map(([key, loc]) => {
              const markerColor =
                loc.category === "Food"
                  ? "#F59E0B"
                  : loc.category === "Hostels"
                  ? "#EC4899"
                  : loc.category === "Facilities"
                  ? "#10B981"
                  : "#6366F1";
              return (
                <Marker
                  key={key}
                  position={[loc.lat, loc.lng]}
                  icon={createCustomMarker(markerColor)}
                >
                  <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                    <span>{loc.name}</span>
                  </Tooltip>
                  <Popup>
                    <div style={{ textAlign: "left" }}>
                      <b>{loc.name}</b>
                      <br />
                      <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                        Category: {loc.category}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </LayerGroup>

          {routeGeoJson && (
            <GeoJSON
              key={JSON.stringify(routeGeoJson)}
              data={routeGeoJson}
              style={{ color: "#06B6D4", weight: 6, opacity: 0.9 }}
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
      </div>

      {/* 4. Bottom Category Quick Filter Chips */}
      <div className="map-category-chips">
        {["All", "Academic", "Hostels", "Food", "Facilities", "Gates"].map(
          (cat) => (
            <button
              key={cat}
              className={`category-chip-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "All" ? "📍 All Locations" : cat}
            </button>
          )
        )}
      </div>
    </div>
  );
});

export default MapComponent;
