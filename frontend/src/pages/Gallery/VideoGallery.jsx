import React from 'react'
import { Link } from 'react-router-dom'
import { TbVideo } from "react-icons/tb";
import GalleryCard from '../../component/GalleryCard/GalleryCard'

const VideoGallery = () => {
  return (
   <div className='p-4 bg-white dark:bg-black min-h-screen'>
      <div className="mb-8 ">
        <h1 className=" flex items-center gap-2 text-2xl lg:text-3xl font-bold text-red-600 mb-3">
           <TbVideo className="text-3xl" /> Video Gallery
        </h1>
        <div className="w-full h-1 bg-red-600 rounded"></div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <Link to="/gallery/:Committees/videos">
          <GalleryCard />
        </Link>
        <Link to="/gallery/:Committees/videos">
          <GalleryCard />
        </Link>
        <Link to="/gallery/:Committees/videos">
          <GalleryCard />
        </Link>
        <Link to="/gallery/:Committees/videos">
          <GalleryCard />
        </Link>
        <Link to="/gallery/:Committees/videos">
          <GalleryCard />
        </Link>
      </div>
    </div>
  )
}

export default VideoGallery