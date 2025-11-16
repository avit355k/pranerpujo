import React from "react";
import { IoLocationSharp } from "react-icons/io5";

const GalleryCard = ({ pandel, onClick }) => {
  if (!pandel) return null;

  return (
    <div
      onClick={onClick}
      className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden 
                 transition-transform duration-300 border border-gray-400 
                 dark:border-gray-700 cursor-pointer w-full max-w-sm mx-auto hover:scale-104"
    >
      {/* Image Section */}
      <div className="h-48 sm:h-56 md:h-48 lg:h-56 w-full overflow-hidden">
        <img
          src={pandel.logo || "/placeholder.jpg"}
          alt={pandel.name || "Pandel"}
          className="h-full w-full object-cover transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Puja Name */}
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
          {pandel.name}
        </h2>

        {/* Location */}
        <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-2">
          <IoLocationSharp className="mr-1 text-red-500" />
          {pandel.location?.city || "Unknown"}
        </p>

        {/* Zone */}
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Zone:</span> {pandel.zone || "N/A"}
        </p>
      </div>

      {/* Button */}
      <div className="w-full py-2 bg-red-600 text-white font-medium rounded-b-lg 
                      hover:bg-red-700 text-center">
        View Gallery
      </div>
    </div>
  );
};

export default GalleryCard;
