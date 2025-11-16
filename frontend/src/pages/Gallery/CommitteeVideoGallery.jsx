import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { TbVideoMinus } from "react-icons/tb";
import axios from "axios";
import { API } from "../../services/api";

const CommitteeVideoGallery = () => {
  const { id } = useParams();
  const [pandel, setPandel] = useState(null);
  const [videos, setVideos] = useState({});
  const years = [2025, 2024, 2023]; // 👈 Years to display

  // ✅ Fetch Pandel Details
  useEffect(() => {
    const fetchPandel = async () => {
      try {
        const res = await axios.get(`${API}/api/pandel/${id}`);
        setPandel(res.data);
      } catch (err) {
        console.error("Error fetching pandel details:", err);
      }
    };
    if (id) fetchPandel();
  }, [id]);

  // ✅ Fetch videos for all defined years
  useEffect(() => {
    const fetchVideos = async () => {
      const results = {};
      for (const year of years) {
        try {
          const res = await axios.get(
            `${API}/api/gallery/video/${id}/${year}`
          );
          results[year] = res.data.video;
        } catch {
          results[year] = null;
        }
      }
      setVideos(results);
    };
    if (id) fetchVideos();
  }, [id]);

  if (!pandel)
    return (
      <p className="text-center text-red-500 py-8">
        Loading committee details...
      </p>
    );

  return (
    <section className="px-4 sm:px-8 py-10 bg-white dark:bg-black transition-colors duration-300 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-neutral-900 p-6 shadow-sm rounded-lg">
        <img
          src={pandel.logo}
          alt="committee_logo"
          className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
            {pandel.name}
          </h1>
          <p className="flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            Zone <IoLocationSharp className="text-red-600 mx-1" /> {pandel.zone}
          </p>
        </div>
      </header>

      {/* Section Divider */}
      <div className="w-full h-1 bg-red-600 rounded my-6"></div>

      {/* Section Title */}
      <div className="flex items-center gap-2 mb-8">
        <TbVideoMinus className="text-3xl text-red-600" />
        <h2 className="text-2xl lg:text-3xl font-bold text-red-600">
          Check out latest videos
        </h2>
      </div>

      {/* Video Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {years.map((year) => (
          <div
            key={year}
            className="bg-gray-100 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-300 
                      dark:border-gray-700 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
          >
            {/* Title */}
            <div className="bg-white dark:bg-neutral-900 text-black dark:text-white text-center py-2 font-mono font-semibold text-lg w-full">
              {pandel.name}{" "}
              <span className="font-semibold text-orange-500">{year}</span>
            </div>

            {/* Conditional video or placeholder */}
            {videos[year] ? (
              <div className="relative w-full aspect-video">
                <iframe
                  src={videos[year]}
                  title={`Puja Theme Video ${year}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-b-2xl"
                ></iframe>
              </div>
            ) : (
              <div className="relative w-full aspect-video flex items-center justify-center bg-gray-200 dark:bg-neutral-800">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png"
                  alt="Coming Soon"
                  className="w-24 h-24 opacity-70 animate-pulse"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommitteeVideoGallery;
