import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../services/api";
import { IoLocationSharp } from "react-icons/io5";

const CommiteePhotoGallery = () => {
  const { id } = useParams(); // pandel id
  const [pandel, setPandel] = useState(null);
  const [themeImages, setThemeImages] = useState({});
  const navigate = useNavigate();

  const galleryYears = [2025, 2024, 2023]; // You can make this dynamic later

  // Fetch pandel details
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

  // Fetch mainImage for each year
  useEffect(() => {
    const fetchThemes = async () => {
      if (!id) return;
      const newThemeImages = {};

      for (const year of galleryYears) {
        try {
          const res = await axios.get(
            `${API}/api/theme/pandel/${id}/year/${year}`
          );
          const theme = res.data?.[0];
          newThemeImages[year] =
            theme?.mainImage ||
            "https://massart.in/wp-content/uploads/2024/11/baghbazarbanner-min-scaled.jpg";
        } catch (err) {
          newThemeImages[year] =
            "https://massart.in/wp-content/uploads/2024/11/baghbazarbanner-min-scaled.jpg";
        }
      }

      setThemeImages(newThemeImages);
    };

    fetchThemes();
  }, [id]);

  if (!pandel)
    return <p className="text-center text-red-500 py-8">Pandel not found.</p>;

  return (
    <section className="px-0 py-0 bg-white dark:bg-black transition-colors duration-300">
      {/* Header Section */}
      <div className="mb-8">
        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-black p-6 shadow-sm">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={pandel.logo}
              alt="committee_logo"
              className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
            />
          </div>

          {/* Committee Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
              {pandel.name}
            </h1>
            <p className="flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Zone <IoLocationSharp className="text-red-600 mx-1" /> {pandel.zone}
            </p>
          </div>
        </header>
        <div className="w-full h-1 bg-red-600 rounded"></div>
      </div>

      {/* Gallery Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {galleryYears.map((year) => (
            <div
              key={year}
              className="bg-gray-100 dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-400 
                dark:border-gray-700 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={themeImages[year]}
                alt={`Gallery ${year}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {pandel.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Gallery Year : {year}
                </p>
              </div>
              <button
                onClick={() => navigate(`/gallery/${id}/${year}/photos`)} // ✅ navigate to year-wise gallery
                className="cursor-pointer py-2 w-full bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Open Gallery
              </button>
            </div>
          ))}
        </div>
      </div>
      <br />
    </section>
  );
};

export default CommiteePhotoGallery;
