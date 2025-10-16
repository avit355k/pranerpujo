import React from 'react'
import { IoLocationSharp } from "react-icons/io5";

const GalleryCard = () => {
  return (
    <div className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden 
                    transition-transform duration-300 border border-gray-400 
                    dark:border-gray-700 cursor-pointer w-full max-w-sm mx-auto"
    >

      {/* Image Section */}
      <div className="h-48 sm:h-56 md:h-48 lg:h-56 w-full overflow-hidden">
        <img
          src="https://massart.in/wp-content/uploads/2024/11/download-66.jpg"
          alt="SamajSebi Sangha"
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Puja Name */}
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
          SamajSebi Sangha
        </h2>

        {/* Location */}
        <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-2">
          <IoLocationSharp className="mr-1 text-red-500" />
          South Kolkata
        </p>

        {/* Zone */}
        <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Zone:</span> South Kolkata
        </p>
      </div>

      {/* Button */}
      <button className="w-full py-2 bg-red-600 text-white font-medium rounded-b-lg 
                         hover:bg-red-700 transition cursor-pointer">
        View Gallery
      </button>
    </div>
  )
}

export default GalleryCard
