import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { API } from "../../services/api";
import { IoLocationSharp, IoAddCircle } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { MdGpsFixed } from "react-icons/md";
import { FaTrashAlt, FaMap } from "react-icons/fa";
import { BsGridFill } from "react-icons/bs";
import { AiOutlineDrag } from "react-icons/ai";

import googlePin from "/google_maps_pin.png";

// ✅ Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: googlePin,
  iconSize: [32, 40],
  iconAnchor: [17, 34],
  popupAnchor: [1, -30],
});

// ✅ FitBounds Component
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
  const [startLocation, setStartLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showOptimization, setShowOptimization] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedOrder, setOptimizedOrder] = useState([]);

  const center = [22.5726, 88.3639]; // Kolkata

  // ✅ Fetch pandals
  useEffect(() => {
    fetch(`${API}/api/pandel`)
      .then((res) => res.json())
      .then((data) => {
        setPandals(data);
        setFilteredPandals(data);
      })
      .catch((err) => console.error("Error fetching pandals:", err));
  }, []);

  // ✅ Filter by name
  useEffect(() => {
    const filtered = pandals.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPandals(filtered);
  }, [searchTerm, pandals]);

  // ✅ Add to list
  const handleAddToList = (pandal) => {
    if (!myList.find((p) => p._id === pandal._id)) {
      setMyList([...myList, pandal]);
    }
  };

  // ✅ Remove from list
  const handleRemove = (id) => {
    setMyList(myList.filter((p) => p._id !== id));
  };

  // ✅ Current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = {
          name: "My Current Location",
          _id: "current-location",
          location: { latitude, longitude },
        };
        setCurrentLocation([latitude, longitude]);

        setMyList((prev) => {
          const others = prev.filter((p) => p._id !== "current-location");
          return [loc, ...others];
        });
      },
      () => alert("Unable to fetch your location.")
    );
  };

  // ✅ Search address
  const handleSearchAddress = async () => {
    if (!startLocation.trim()) return alert("Enter an address to search.");
    setLoadingAddress(true);

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          startLocation
        )}`
      );

      if (res.data.length === 0) {
        alert("No location found. Try a more specific address.");
        return;
      }

      const { lat, lon, display_name } = res.data[0];
      const loc = {
        name: display_name.split(",")[0],
        _id: "searched-location",
        location: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
      };

      setCurrentLocation([parseFloat(lat), parseFloat(lon)]);

      setMyList((prev) => {
        const others = prev.filter(
          (p) => p._id !== "searched-location" && p._id !== "current-location"
        );
        return [loc, ...others];
      });
    } catch (err) {
      console.error("Address search error:", err);
      alert("Failed to find location. Try again.");
    } finally {
      setLoadingAddress(false);
    }
  };

  // ✅ Normal route
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
      setDistance((path.distance / 1000).toFixed(2));
      setTime((path.time / 60000).toFixed(1));
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  useEffect(() => {
    getRoute();
  }, [myList]);

  // ✅ Toggle between Map and Optimization view
  const handleToggleView = async () => {
    if (!showOptimization && myList.length > 2) {
      await handleOptimizeRoute();
    }
    setShowOptimization((prev) => !prev);
  };

  // ✅ Route Optimization using GraphHopper
  const handleOptimizeRoute = async () => {
    if (myList.length < 2) return alert("Add at least 2 pandals to optimize.");

    setOptimizing(true);
    setOptimizedOrder([]);

    try {
      const key = import.meta.env.VITE_GRAPHHOPPER_API_KEY;

      const start = myList[0].location;
      const services = myList.slice(1).map((p, i) => ({
        id: p._id,
        name: p.name,
        address: {
          location_id: p._id,
          lon: p.location.longitude,
          lat: p.location.latitude,
        },
      }));

      const body = {
        vehicles: [
          {
            vehicle_id: "vehicle_1",
            start_address: {
              location_id: "start",
              lon: start.longitude,
              lat: start.latitude,
            },
          },
        ],
        services,
      };

      const res = await axios.post(
        `https://graphhopper.com/api/1/vrp?key=${key}`,
        body,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!res.data || !res.data.solution || !res.data.solution.routes?.length) {
        throw new Error("No optimized route found");
      }

      const route = res.data.solution.routes[0];
      const order = route.activities
        .filter((a) => a.type === "service")
        .map((a) => a.id);

      setOptimizedOrder(order);
    } catch (err) {
      console.error("Optimization error:", err.response?.data || err.message);
      alert("Optimization failed. Check API key or quota.");
    } finally {
      setOptimizing(false);
    }
  };


  return (
    <section
      className="bg-white dark:bg-black min-h-[90vh] flex flex-col lg:flex-row gap-6 p-6 transition-colors duration-300 relative"
      style={{ zIndex: 1 }}
    >
      {/* === Sidebar === */}
      <div className="lg:w-1/3 w-full bg-neutral-100 dark:bg-neutral-900 p-4 rounded-2xl shadow-md flex flex-col max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Plan Your Route
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search pandals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        {/* Starting Location */}
        <div className="bg-white dark:bg-neutral-950 rounded-md p-4 mb-4">
          <h2 className="flex font-semibold text-gray-800 dark:text-white gap-2 items-center">
            <span className="text-green-500">
              <IoLocationSharp size={20} />
            </span>
            Choose Starting Location
          </h2>

          <div className="relative mt-4">
            <MdGpsFixed
              onClick={handleCurrentLocation}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600 dark:text-red-500 cursor-pointer"
              size={20}
              title="Use Current Location"
            />
            <input
              type="text"
              placeholder="Enter address (optional)"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <IoIosSearch
              onClick={handleSearchAddress}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${loadingAddress
                  ? "text-gray-400"
                  : "text-gray-600 dark:text-gray-400"
                } cursor-pointer`}
              size={22}
              title="Search Address"
            />
          </div>
        </div>

        {/* My List */}
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
            <div className="text-gray-700 dark:text-gray-200 text-sm">
              No pandals added yet
            </div>
          ) : (
            <ul className="space-y-2 text-sm">
              {myList.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between items-center bg-red-100 dark:bg-neutral-700 px-3 py-2 rounded"
                >
                  <span>{p.name}</span>
                  <div className="flex gap-2">
                    <button className="text-green-500 cursor-grab" title="Drag">
                      <AiOutlineDrag size={14} />
                    </button>
                    <button
                      onClick={() => handleRemove(p._id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      title="Remove"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Route Info */}
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

        {/* Floating Toggle Button */}
        <button
          onClick={handleToggleView}
          className="fixed bottom-5 left-5 z-50 bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-transform duration-300 hover:scale-105 focus:outline-none cursor-pointer"
          title={showOptimization ? "Show Map" : "Optimize Route"}
        >
          {showOptimization ? <FaMap size={18} /> : <BsGridFill size={18} />}
        </button>
      </div>

      {/* === Right Section === */}
      <div className="lg:w-2/3 w-full relative">
        {!showOptimization ? (
          // ✅ Map Section
          <MapContainer
            center={currentLocation || center}
            zoom={12}
            style={{
              height: "500px",
              borderRadius: "1rem",
              zIndex: 0,
            }}
          >
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />

            {filteredPandals
              .filter((p) => p.location?.latitude && p.location?.longitude)
              .map((p) => (
                <Marker
                  key={p._id}
                  position={[p.location.latitude, p.location.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-bold mb-1">{p.name}</h3>
                      {p.logo && (
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                      )}
                      <button
                        onClick={() => handleAddToList(p)}
                        className="flex gap-2 items-center bg-red-600 text-white w-full text-xs px-2 py-1 rounded hover:bg-red-700 cursor-pointer"
                      >
                        <IoAddCircle size={20} /> Add to My List
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {currentLocation && (
              <Marker position={currentLocation} icon={customIcon}>
                <Popup>Starting Point</Popup>
              </Marker>
            )}

            {routeCoords.length > 0 && (
              <>
                <Polyline positions={routeCoords} color="red" weight={4} />
                <FitBounds routeCoords={routeCoords} />
              </>
            )}
          </MapContainer>
        ) : (
          // ✅ Optimization Section
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl shadow-md min-h-[500px] flex flex-col justify-center items-center text-gray-800 dark:text-white">
            <h2 className="text-3xl text-red-600 font-bold mb-6">Optimized Route Order</h2>

            {optimizing ? (
              <p className="text-gray-500 animate-pulse">Optimizing route...</p>
            ) : optimizedOrder.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
                {optimizedOrder.map((id, i) => {
                  const p = myList.find((x) => x._id === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-neutral-800 dark:to-neutral-900 border border-red-200 dark:border-neutral-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4"
                    >
                      {/* Number badge at the start */}
                      <div className="flex-shrink-0 bg-red-500 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                        {i + 1}
                      </div>

                      {/* Card content */}
                      <div className="text-left">
                        <h3 className="text-lg font-semibold">
                          {p ? p.name : "Unknown"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Stop {i + 1} in optimized route
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No optimized result yet.</p>
            )}
          </div>

        )}
      </div>
    </section>
  );
};

export default Map;
