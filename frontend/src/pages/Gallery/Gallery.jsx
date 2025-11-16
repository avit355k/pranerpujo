import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbBrandAppgallery } from "react-icons/tb";
import GalleryCard from "../../component/GalleryCard/GalleryCard";
import axios from "axios";

const Gallery = () => {
  const [pandels, setPandels] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch all pandels from backend
  useEffect(() => {
    const fetchPandels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pandel");
        const data = Array.isArray(res.data) ? res.data : [];
        setPandels(data);
      } catch (error) {
        console.error("Error fetching pandels:", error);
        setPandels([]);
      }
    };
    fetchPandels();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl lg:text-3xl font-bold text-red-600 mb-3">
          <TbBrandAppgallery className="text-3xl" /> Photo Gallery
        </h1>
        <div className="w-full h-1 bg-red-600 rounded"></div>
      </div>

      {/* Gallery Grid */}
      {pandels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pandels.map((pandel) => (
            <GalleryCard
              key={pandel._id}
              pandel={pandel}
              onClick={() => navigate(`/gallery/${pandel._id}/photos`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No pandels found.
        </p>
      )}
    </div>
  );
};

export default Gallery;
