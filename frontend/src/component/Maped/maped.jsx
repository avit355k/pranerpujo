import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { IoLocationSharp } from "react-icons/io5";

const Marker = ({ text }) => (
  <div className="flex flex-col items-center">
    <IoLocationSharp className="text-red-600 text-2xl" />
    <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded shadow">
      {text}
    </span>
  </div>
);

const Maped = () => {
  const [pandals, setPandals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/pandel")
      .then((res) => res.json())
      .then((data) => {
        setPandals(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching pandals:", err));
  }, []);

  const defaultProps = {
    center: { lat: 22.5726, lng: 88.3639 },
    zoom: 12,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[500px] bg-gray-100 rounded-2xl shadow-md">
        <p className="text-gray-600 font-medium">Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-2xl relative z-10">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        options={{
    styles: [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e3f2fd" }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }],
      },
    ],
  }}
      >
        {pandals.map((pandal) => (
          <Marker
            key={pandal._id}
            lat={pandal.location.latitude}
            lng={pandal.location.longitude}
            text={pandal.name}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Maped;
