import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { IoLocationSharp } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";

// ✅ Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ✅ Auto fit bounds on route
const FitBounds = ({ routeCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [routeCoords, map]);
  return null;
};

const Map = () => {
  const [pandals, setPandals] = useState([]);
  const [filteredPandals, setFilteredPandals] = useState([]);
  const [myList, setMyList] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const center = [22.5726, 88.3639]; // Kolkata

  // ✅ Fetch pandal list
  useEffect(() => {
    fetch("http://localhost:5000/api/pandel")
      .then((res) => res.json())
      .then((data) => {
        setPandals(data);
        setFilteredPandals(data);
      })
      .catch((err) => console.error("Error fetching pandals:", err));
  }, []);

  // ✅ Filter search results dynamically
  useEffect(() => {
    const filtered = pandals.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPandals(filtered);
  }, [searchTerm, pandals]);

  // ✅ Add pandal to list
  const handleAddToList = (pandal) => {
    if (!myList.find((p) => p._id === pandal._id)) {
      setMyList([...myList, pandal]);
    }
  };

  // ✅ Remove pandal from list
  const handleRemove = (id) => {
    setMyList(myList.filter((p) => p._id !== id));
  };

  // ✅ Get route from GraphHopper
  const getRoute = async () => {
    if (myList.length < 2) {
      setRouteCoords([]);
      setDistance(null);
      setTime(null);
      return;
    }

    const key = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
    const points = myList
      .map((p) => `point=${p.location.latitude},${p.location.longitude}`)
      .join("&");

    try {
      const res = await axios.get(
        `https://graphhopper.com/api/1/route?${points}&vehicle=car&locale=en&points_encoded=false&key=${key}`
      );

      const path = res.data.paths[0];
      const coords = path.points.coordinates.map(([lng, lat]) => [lat, lng]);
      setRouteCoords(coords);
      setDistance((path.distance / 1000).toFixed(2)); // km
      setTime((path.time / 60000).toFixed(1)); // minutes
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  // ✅ Update route when list changes
  useEffect(() => {
    getRoute();
  }, [myList]);

  return (
    <section className="bg-white dark:bg-black min-h-[90vh] flex flex-col lg:flex-row gap-6 p-6 transition-colors duration-300">
      {/* === Left Sidebar === */}
      <div className="lg:w-1/3 w-full bg-red-50 dark:bg-neutral-900 p-4 rounded-2xl shadow-md flex flex-col max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Plan Your Route
        </h2>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search pandals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        {/* 📍 My List */}
        <div className="bg-white dark:bg-neutral-950 rounded-md shadow-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              My Pandal List
            </h3>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              {myList.length}
            </span>
          </div>

          {myList.length === 0 ? (
            <div className=" text-gray-700 dark:text-gray-200 text-sm">No pandals added yet</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {myList.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between items-center bg-red-100 dark:bg-neutral-700 px-3 py-2 rounded"
                >
                  <span>{p.name}</span>
                  <button
                    onClick={() => handleRemove(p._id)}
                    className="text-red-600 hover:text-red-900 cursor-pointer"
                    title="Remove"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* 🚗 Route Info */}
          {distance && time && (
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-200 bg-red-100 dark:bg-neutral-800 p-3 rounded-lg">
              <p>
                <strong>Distance:</strong> {distance} km
              </p>
              <p>
                <strong>Estimated Time:</strong> {time} mins
              </p>
            </div>
          )}
        </div>
      </div>

      {/* === Map Section === */}
      <div className="lg:w-2/3 w-full">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: "500px", borderRadius: "1rem" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          />

          {/* 🗺 Show all filtered pandals */}
          {filteredPandals
            .filter((p) => p.location?.latitude && p.location?.longitude)
            .map((p) => (
              <Marker
                key={p._id}
                position={[p.location.latitude, p.location.longitude]}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-bold mb-1">{p.name}</h3>
                    {p.mainImage && (
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                    )}
                    <button
                      onClick={() => handleAddToList(p)}
                      className="bg-red-600 text-white w-full text-xs px-2 py-1 rounded hover:bg-red-700 cursor-pointer"
                    >
                      ➕ Add to My List
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* 🚗 Route Line */}
          {routeCoords.length > 0 && (
            <>
              <Polyline positions={routeCoords} color="red" weight={4} />
              <FitBounds routeCoords={routeCoords} />
            </>
          )}
        </MapContainer>
      </div>
    </section>
  );
};

export default Map;
