import { useState, useEffect, useRef } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";


const PujacardDetails = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const years = ["2025", "2024", "2023"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const images = [
    "https://sharadshamman.asianpaints.com/images/pandals/2025/Churanto%20Porbe%20uttirno_Samaj%20Sebi%20Sangha.jpg",
    "https://sharadshamman.asianpaints.com/images/pandals/2025/Churanto%20Porbe%20uttirno_%20Alipore%20Sarbojanin.jpg",
    "https://sharadshamman.asianpaints.com/images/pandals/2025/Churanto%20Porbe%20uttirno_Pratapaditya%20Road%20Tricone%20Park.jpg",
    "https://sharadshamman.asianpaints.com/images/pandals/2025/Churanto%20Porbe%20uttirno_%20Dum%20Dum%20Park%20Bharat%20Chakra%20Club.jpg",
    "https://sharadshamman.asianpaints.com/images/pandals/2025/Churanto%20Porbe%20uttirno_Kashi%20Bose%20Lane%20Durga%20Puja%20Samity.jpg",
    "https://sharadshamman.asianpaints.com/images/pandals/2025/Churanto%20Porbe%20uttirno_%20Behala%20Friends.jpg",
  ];

  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <section className="px-0 py-0 bg-white dark:bg-black transition-colors duration-300">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-neutral-900 p-6 shadow-sm">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="https://samajsebi.com/img/logo.jpg"
            alt="committee_logo"
            className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
          />
        </div>

        {/* Committee Info */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
            SamajSebi Sangha
          </h1>
          <p className="flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            Zone<IoLocationSharp className="text-red-600 mr-1 ml-1" /> :
            South Kolkata
          </p>
        </div>
      </header>

      {/* Puja Card Details Table */}
      <div className="mt-8 overflow-x-auto mx-2 rounded-lg border border-gray-300 dark:border-gray-700">
        <table className="min-w-full border-collapse  ">
          <thead>
            <tr className="bg-red-600 text-white text-left">
              <th colSpan="2" className="px-6 py-3 text-lg font-semibold">
                Puja Committee Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Name of the Puja Committee
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                SamajSebi Sangha
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Address
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                24A, Lake View Road, Kolkata - 700029
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Puja Estd. Year
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                1946 - (Current Age: 80 Years)
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Puja Type
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                Barowari
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Zone
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                South Kolkata
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Nearest Metro/Railway/Bus Stopage
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                KaliGhat Metro Station, Ballygaunj Station
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Contact Number
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                98300-35979, 98300-31483, 98300-41131
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Official E-mail
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                info@samajsebi.com
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Official Facebook Page
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                <a href="https://www.facebook.com/share/16VW2GposQ/">SamajSebi.facebook.in</a>
              </td>
            </tr>
            <tr className="hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
              <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                Official Website
              </td>
              <td className="px-6 py-3 text-gray-700 dark:text-gray-300 break-words">
                <a href="https://samajsebi.com/index-2.html">samajsebi.com</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />

      {/* Theme Details Of Puja */}
      <div className="flex justify-between items-center px-6 py-4 dark:bg-black shadow-sm">
        <h1 className="text-xl font-semibold font-serif text-red-600">Theme Details</h1>
        {/* Dropdown for Year Selection */}
        <div ref={dropdownRef} className="relative w-24">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-red-800 text-white px-4 py-2 rounded-lg w-full text-left font-medium cursor-pointer hover:bg-red-700 transition-colors duration-300 focus:outline-none"
          >
            {selectedYear}
            <span className="float-right"> <FaChevronDown /> </span>
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

        <div className="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-lg">
          <table className="min-w-full border-collapse ">
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
                  "Pather Panchali (1946)"
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200 align-top">
                  Concept
                </td>
                <td className="px-6 py-3 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
                  Samaj Sebi started its puja way back in 1946, right after the riot, and the theme is their
                  interpersonal storyline. The pandal is a showcase of communal harmony and the attempt
                  that the people during those times took to bring back a state of normalcy. This year’s
                  pujo will be the beginning of the creation of a model street with art deco homes.
                  The deity is embracing the euphony with ten hands, and she is in command of bringing
                  a better tomorrow, one without violence and riots.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                  Artist
                </td>
                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                  Pradip Das
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">
                  Idol Artist
                </td>
                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                  Pintu Sikder
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <h1 className="text-lg font-bold  text-red-600 pl-4">
          Gallery:{" "}
          <span className="text-red-600 font-semibold ">{selectedYear}</span>
        </h1>
        <br />
        {/* Gallery Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`gallery-${i}`}
              className="w-full h-auto rounded-lg shadow-md cursor-pointer  transition-transform"
              onClick={() => setSelectedIndex(i)}
            />
          ))}

          <Lightbox
            slides={images.map((src) => ({ src }))}
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

        {/* Embedded YouTube Video */}
        <div className="mt-4 w-full flex justify-center">
          <div className="w-full md:w-3/4 lg:w-1/2 aspect-video rounded-xl overflow-hidden shadow-lg border border-red-200">
            <iframe
              src="https://www.youtube.com/embed/aCdcgV_AEWQ?si=unb3P6tAtt5iJ4Gr"
              title="Puja Theme Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

      </div>
      <br />
    </section>
  );
};

export default PujacardDetails;
