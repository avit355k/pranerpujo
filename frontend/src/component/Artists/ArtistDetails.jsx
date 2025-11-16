import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoIosBackspace } from "react-icons/io";

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/artist/${id}`);
        const data = await res.json();
        setArtist(data);
      } catch (error) {
        console.error("Error fetching artist details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-neutral-700 dark:text-neutral-300">
        Loading artist details...
      </div>
    );

  if (!artist)
    return (
      <div className="text-center py-20 text-neutral-700 dark:text-neutral-300">
        Artist not found.
      </div>
    );

  return (
    <section className="py-8 px-8 md:px-16 lg:px-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <Link
        to="/artists"
        className="inline-block mb-6 text-red-600 hover:underline"
      >
        <IoIosBackspace size={22}/>
      </Link>

      <div className="max-w-6xl mx-auto bg-neutral-200 dark:bg-neutral-900 rounded-2xl shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={artist.image || "/avatar.jpg"}
            alt={artist.name}
            className="w-full md:w-1/3 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-red-600 mb-2">
              {artist.name}
            </h1>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
              {artist.role || artist.specialization || "Artist"}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {artist.bio || "No bio available for this artist."}
            </p>
          </div>
        </div>

        {/* Artworks Section */}
        {artist.works && artist.works.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-6">
              Artworks
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.works.map((work, i) => (
                <div
                  key={i}
                  className="bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={
                      work.theme?.mainImage ||
                      work.image ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={work.theme?.title || "Artwork"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-1">
                      {work.theme?.title || work.description || "Untitled"}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Year:</span> {work.year}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Pandel:</span>{" "}
                      {work.pandel?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistDetails;
