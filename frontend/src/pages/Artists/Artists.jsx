import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleUp } from "react-icons/fa";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Fetch all artists initially
  const fetchArtists = async (query = "") => {
    try {
      const url =
        query.trim() === ""
          ? "http://localhost:5000/api/artist"
          : `http://localhost:5000/api/artist/search/${query}`;
      const res = await fetch(url);
      const data = await res.json();
      setArtists(data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // Auto search when typing (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArtists(searchQuery);
    }, 400); // 400ms debounce for smoother UX
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Manual search button click
  const handleSearchClick = () => {
    fetchArtists(searchQuery);
  };

  // Scroll listener for Go-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-neutral-700 dark:text-neutral-300">
        Loading artists...
      </div>
    );

  return (
    <section className="py-6 px-4 md:px-12 lg:px-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <h1 className="text-4xl font-bold  text-red-600 mb-10">
        Artist Collection
      </h1>

      {/* 🔍 Search Section */}
      <div className="flex flex-col sm:flex-row justify-center items-center mb-6 w-full mx-auto border rounded-md overflow-hidden shadow-sm">
        <button
          onClick={handleSearchClick}
          className="bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold px-4 py-2 w-full sm:w-auto border-r dark:border-neutral-700 cursor-pointer"
        >
          Search
        </button>
        <input
          type="text"
          placeholder="Type to Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
          className="flex-1 px-4 py-2 w-full outline-none bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
        />
      </div>

      {/* 📋 Artist List Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-200">
              <th className="p-3 text-left w-16">#</th>
              <th className="p-3 text-left">Artist Name</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {artists.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-neutral-700 dark:text-neutral-300"
                >
                  No artists found.
                </td>
              </tr>
            ) : (
              artists.map((artist, index) => (
                <tr
                  key={artist._id}
                  className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <td className="p-3 text-neutral-700 dark:text-neutral-300">
                    {index + 1}
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/artists/${artist._id}`}
                      className="text-red-600 font-medium hover:underline"
                    >
                      {artist.name}
                    </Link>
                  </td>
                  <td className="p-3 text-neutral-700 dark:text-neutral-300">
                    {artist.role || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔝 Go to Top Button */}
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

export default Artists;
