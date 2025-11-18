import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../../services/api";

import { IoLocationSharp } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const PujacardDetails = () => {
  const { id } = useParams(); // get pandel ID from URL
  const [pandel, setPandel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState("2025");
  const [theme, setTheme] = useState(null);
  const [themeLoading, setThemeLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const years = ["2025", "2024", "2023"];

  // Fetch pandel details
  useEffect(() => {
    const fetchPandel = async () => {
      try {
        const res = await axios.get(`${API}/api/pandel/${id}`);
        setPandel(res.data);
      } catch (err) {
        console.error("Error fetching pandel details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPandel();
  }, [id]);

  // Fetch theme by pandel id and year
  useEffect(() => {
    const fetchTheme = async () => {
      if (!id || !selectedYear) return;
      setTheme(null);
      setThemeLoading(true);
      try {
        const res = await axios.get(
          `${API}/api/theme/pandel/${id}/year/${selectedYear}`
        );
        setTheme(res.data?.[0] || null);
      } catch (err) {
        console.error("Error fetching theme:", err);
      } finally {
        setThemeLoading(false);
      }
    };
    fetchTheme();
  }, [id, selectedYear]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  if (loading)
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  if (!pandel)
    return <div className="text-center py-8 text-red-500">No data found</div>;

  return (
    <section className="px-0 py-0 bg-white dark:bg-black transition-colors duration-300">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-neutral-900 p-6 shadow-sm">
        <div className="flex-shrink-0">
          <img
            src={pandel.logo}
            alt="committee_logo"
            className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
          />
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
            {pandel.name}
          </h1>
          <p className="flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            Zone <IoLocationSharp className="text-red-600 mr-1 ml-1" /> :
            {pandel.zone}
          </p>
        </div>
      </header>

      {/* Puja Details */}
      <div className="mt-8 overflow-x-auto mx-2 rounded-lg border border-gray-300 dark:border-gray-700">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-red-600 text-white text-left">
              <th colSpan="2" className="px-6 py-3 text-lg font-semibold">
                Puja Committee Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Name of the Puja Committee
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                {pandel.name}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Address
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                {pandel.address}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Puja Estd. Year
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                {pandel.founded
                  ? `${pandel.founded} (${new Date().getFullYear() - pandel.founded + 1
                  } Years)`
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Puja Type
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                {pandel.type}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Zone
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                {pandel.zone}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Nearest Metro/Railway/Bus Stopage
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                {[
                  pandel.nearestLocation?.metro,
                  pandel.nearestLocation?.railway,
                  pandel.nearestLocation?.bus,
                ]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Contact Number
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                {pandel.contactNumbers?.length
                  ? pandel.contactNumbers.join(", ")
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Official E-mail
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                {pandel.email}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Official Facebook Page
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                {pandel.socialLinks?.facebook && (
                  <a
                    href={pandel.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pandel.socialLinks.facebook}
                  </a>
                )}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Official Website
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                {pandel.socialLinks?.website && (
                  <a
                    href={pandel.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {pandel.socialLinks.website}
                  </a>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      {/* Theme Details Of Puja */}
      <div className="flex justify-between items-center px-6 py-4 dark:bg-black shadow-sm">
        <h1 className="text-xl font-semibold font-serif text-red-600">
          Theme Details
        </h1>

        {/* Dropdown */}
        <div ref={dropdownRef} className="relative w-24">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-red-800 text-white px-4 py-2 rounded-lg w-full text-left font-medium cursor-pointer hover:bg-red-700 transition-colors duration-300 focus:outline-none"
          >
            {selectedYear}
            <span className="float-right">
              <FaChevronDown />
            </span>
          </button>

          {isOpen && (
            <ul className="absolute z-10 bg-white border rounded-lg mt-1 w-full shadow-lg">
              {years.map((year) => (
                <li
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-yellow-300 rounded-md transition-colors duration-200 ${selectedYear === year ? "bg-amber-200 font-semibold" : ""
                    }`}
                >
                  {year}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Display Selected Year */}
      <div className="p-2">
        {themeLoading ? (
          <div className="text-center text-gray-500 py-4">Loading theme...</div>
        ) : theme ? (
          <>
            <div className="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-lg">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-red-600 text-white text-left">
                    <th colSpan="2" className="px-6 py-3 text-lg font-semibold">
                      Theme Information
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200 w-1/3">
                      Title
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {theme.title}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200 align-top">
                      Concept
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
                      {theme.concept}
                    </td>
                  </tr>

                  {theme.artists?.map((a, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                        {a.roles.join(", ")}
                      </td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                        {a.artist?.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <br />
            <h1 className="text-lg font-bold text-red-600 pl-4">
              Gallery:{" "}
              <span className="text-red-600 font-semibold">{selectedYear}</span>
            </h1>
            <br />

            {/* Gallery */}
            <div className="overflow-hidden shadow-sm bg-gray-50 dark:bg-black p-3 sm:p-6">
              <RowsPhotoAlbum
                photos={
                  theme.gallery?.map((src) => ({
                    src,
                    width: 1000,
                    height: 665,
                  })) || []
                }
                targetRowHeight={250}
                spacing={20}
                onClick={({ index }) => setSelectedIndex(index)}
              />

              <Lightbox
                slides={
                  theme.gallery?.map((src) => ({
                    src,
                    width: 1000,
                    height: 665,
                  })) || []
                }
                open={selectedIndex >= 0}
                index={selectedIndex}
                close={() => setSelectedIndex(-1)}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
              />
            </div>

            <br />
            <h1 className="text-lg font-bold text-red-600">
              Video:{" "}
              <span className="text-red-600 font-semibold">{selectedYear}</span>
            </h1>
         {/*youtuve link*/}
            <div className="mt-4 w-full flex justify-center">
              <div className="w-full md:w-3/4 lg:w-1/2 aspect-video rounded-xl overflow-hidden shadow-lg border border-red-200">
                <iframe
                  src={theme.youtubeLink}
                  title="Puja Theme Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No theme available for {selectedYear}
          </div>
        )}
      </div>
      <br />
    </section>
  );
};

export default PujacardDetails;
