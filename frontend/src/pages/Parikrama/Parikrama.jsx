import React, { useState } from "react";
import PujaCard from "./../../component/Pujacard/PujaCard";
import { FaSearch } from "react-icons/fa";

const Parikrama = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
                onChange={handleSearch} 
                className="w-full px-4 py-2 pr-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-neutral-950 dark:text-white dark:border-gray-700"
              />
              {/* Properly centered search icon */}
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
              <option value="north">North Zone</option>
              <option value="south">South Zone</option>
              <option value="east">East Zone</option>
              <option value="west">West Zone</option>
              <option value="central">Central Zone</option>
              <option value="bonedibari">Bonedi Bari</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setZoneFilter("");
            }}
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
            {Array.from({ length: 12 }).map((_, i) => (
              <PujaCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Parikrama;
