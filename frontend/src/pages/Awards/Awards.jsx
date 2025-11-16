import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Winnerlist from "../../component/Awards/Winnerlist";

const Awards = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedAward, setSelectedAward] = useState(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/awards");
        if (!res.ok) throw new Error("Failed to fetch awards");
        const data = await res.json();
        setAwards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  // Filter awards by search term (not year)
  const filteredAwards = awards.filter((award) =>
    award.awardName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse text-lg">
          Loading awards...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">
        Durga Puja Awards
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
        <div className="flex items-center gap-3">
          <label className="text-gray-700 dark:text-gray-300 font-medium">
            Show Winners for:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded-lg px-3 py-2 dark:bg-neutral-800 dark:text-white dark:border-gray-600"
          >
            <option value="All">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search awards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-neutral-950 dark:text-white dark:border-gray-700"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400" />
        </div>
      </div>

      {/* Awards Grid */}
      {filteredAwards.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No awards found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAwards.map((award) => (
            <div
              key={award._id}
              onClick={() => setSelectedAward(award)}
              className="cursor-pointer bg-white dark:bg-neutral-800 rounded-2xl border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center text-center">
                {award.logo && (
                  <img
                    src={award.logo}
                    alt={award.awardName}
                    className="w-24 h-24 object-contain mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {award.awardName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click to view winners
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedAward && (
        <Winnerlist
          award={selectedAward}
          onClose={() => setSelectedAward(null)}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};

export default Awards;
