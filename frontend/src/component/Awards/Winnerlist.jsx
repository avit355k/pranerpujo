import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { API } from "../../services/api";

const Winnerlist = ({ award, onClose, selectedYear }) => {
  const [winnersToShow, setWinnersToShow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true);
        setError(null);

        if (selectedYear === "All") {
          // Show all winners
          setWinnersToShow(award.winners);
        } else {
          // Fetch from backend for specific year
          const res = await fetch(
            `${API}/api/awards/${award._id}/year/${selectedYear}`
          );
          if (!res.ok) throw new Error("Failed to fetch yearwise winners");
          const data = await res.json();

          // Convert to same structure as award.winners for consistency
          setWinnersToShow([
            { year: data.year, pandels: data.pandels },
          ]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [award, selectedYear]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-[90%] md:w-[50%] max-h-[80vh] overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          {award.awardName}
        </h2>
        <hr className="my-3 border-gray-300 dark:border-gray-700" />

        {/* Loading / Error States */}
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6">
            Loading winners...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center py-6">{error}</p>
        ) : winnersToShow && winnersToShow.length > 0 ? (
          winnersToShow
            .sort((a, b) => a.year - b.year)
            .reverse()
            .map((winner, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  {winner.year}
                </h3>

                {winner.pandels && winner.pandels.length > 0 ? (
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    {winner.pandels.map((pandel, idx) => (
                      <li
                        key={idx}
                        className="border-b border-gray-200 dark:border-gray-700 pb-1"
                      >
                        {pandel.name || "Unnamed Pandel"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-500">No pandels available</p>
                )}
              </div>
            ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No winners for selected year
          </p>
        )}
      </div>
    </div>
  );
};

export default Winnerlist;
