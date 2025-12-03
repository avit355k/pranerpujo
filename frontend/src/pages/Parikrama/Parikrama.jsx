import React, { useState, useEffect } from "react";
import PujaCard from "../../component/Pujacard/PujaCard";
import { FaSearch, FaAngleUp } from "react-icons/fa";
import axios from "axios";
import { API } from "../../services/api";

const Parikrama = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [pandels, setPandels] = useState([]);
  const [filteredPandels, setFilteredPandels] = useState([]);

  //  Missing state added
  const [showTopBtn, setShowTopBtn] = useState(false);

  //  Fetch all pandels from backend
  useEffect(() => {
    const fetchPandels = async () => {
      try {
        const res = await axios.get(`${API}/api/pandel`);
        console.log("Fetched Pandels:", res.data);
        const data = Array.isArray(res.data) ? res.data : [];
        setPandels(data);
        setFilteredPandels(data);
      } catch (error) {
        console.error("Error fetching pandels:", error);
        setPandels([]);
        setFilteredPandels([]);
      }
    };
    fetchPandels();
  }, []);

  //  Filter whenever search term or zone changes
  useEffect(() => {
    let filtered = [...pandels];

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (zoneFilter.trim()) {
      filtered = filtered.filter(
        (p) => p.zone?.toLowerCase() === zoneFilter.toLowerCase()
      );
    }

    setFilteredPandels(filtered);
  }, [searchTerm, zoneFilter, pandels]);

  //  Reset Filters
  const handleReset = () => {
    setSearchTerm("");
    setZoneFilter("");
    setFilteredPandels(pandels);
  };

  // Scroll listener for Go-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-auto px-4 py-6 bg-white dark:bg-black transition-colors duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl shadow-lg p-6 h-fit lg:sticky top-20">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 lg:mb-6 border-b pb-2 lg:pb-3">
            Filters
          </h2>

          {/* Search Bar */}
          <div className="mb-4 lg:mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Search Committee
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-neutral-950 dark:text-white dark:border-gray-700"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black dark:text-gray-500 cursor-pointer" />
            </div>
          </div>

          {/* Zone Filter */}
          <div className="mb-4 lg:mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Select Zone
            </label>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-neutral-950 dark:text-white dark:border-gray-700"
            >
              <option value="">All Zones</option>
              <option value="north kolkata">North Kolkata</option>
              <option value="south kolkata">South Kolkata</option>
              <option value="North & East City">North-East Kolkata</option>
              <option value="Behala">West Kolkata</option>
              <option value="Haridevpur & Others">Haridebpur & Others</option>
              <option value="SaltLake & Central">SaltLake & Central</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md transition cursor-pointer"
          >
            Reset Filters
          </button>
        </aside>

        {/* Puja Cards Grid */}
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-red-600 mb-6 lg:mb-10">
            Durga Puja Committees Zonewise
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {Array.isArray(filteredPandels) && filteredPandels.length > 0 ? (
              filteredPandels.map((pandel) => (
                <PujaCard key={pandel._id} pandel={pandel} />
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 col-span-full text-center">
                No pandels found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Go to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-red-600 text-white rounded-full p-3 shadow-lg hover:bg-red-700 transition duration-300 cursor-pointer"
          title="Go to Top"
        >
          <FaAngleUp size={20} />
        </button>
      )}
    </section>
  );
};

export default Parikrama;
