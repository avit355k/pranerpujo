import React, { useState } from 'react';
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PujaCard = ({ pandel }) => {
  const navigate = useNavigate();

  if (!pandel) return null;

  return (
    <div
      onClick={() => navigate(`/puja-details/${pandel._id}`)}
      className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden 
                 transition-transform duration-300 border border-gray-400 
                 dark:border-gray-700 cursor-pointer w-full max-w-sm mx-auto hover:scale-105"
    >
      {/* Image Section */}
      <div className="h-44 sm:h-40 md:h-44 lg:h-52 w-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
        <img
          src={pandel.logo }
          alt={pandel.name || "Pandel"}
          className="h-full w-full object-cover transform  transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Puja Name */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
          {pandel.name}
        </h2>

        {/* Location */}
        <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-2">
          <IoLocationSharp className="mr-1 text-red-500 flex-shrink-0" />
          {pandel.location.city}
        </p>

        {/* Zone */}
        <p className="mt-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Zone:</span> {pandel.zone || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default PujaCard;
