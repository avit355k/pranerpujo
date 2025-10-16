import React from 'react'
import { TbBrandAppgallery } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";

export const CommiteePhotoGallery = () => {
    return (
        <>
            <section className="px-0 py-0 bg-white dark:bg-black transition-colors duration-300">
                <div className="mb-8 ">
                    <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-black p-6 shadow-sm">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <img
                                src="https://samajsebi.com/img/logo.jpg"
                                alt="committee_logo"
                                className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
                            />
                        </div>

                        {/* Committee Info */}
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                                SamajSebi Sangha
                            </h1>
                            <p className="flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                Zone<IoLocationSharp className="text-red-600 mr-1 ml-1" /> :
                                South Kolkata
                            </p>
                        </div>
                    </header>
                    <div className="w-full h-1 bg-red-600 rounded"></div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {/* Example Photo Card */}
                        <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-400 
                    dark:border-gray-700 cursor-pointer shadow-lg">
                            <img src="https://massart.in/wp-content/uploads/2024/11/download-66.jpg" alt="Photo" className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">SamajSebi Sangha</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Gallery Year :2025</p>
                            </div>
                            <button className='cursor-pointer py-2 w-full bg-red-600 text-white rounded hover:bg-red-700 transition'>
                                Open Gallery
                            </button>
                        </div>
                        {/* Repeat Photo Cards as needed */}
                        <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-400 
                    dark:border-gray-700 cursor-pointer shadow-lg">
                            <img src="https://massart.in/wp-content/uploads/2024/11/download-66.jpg" alt="Photo" className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">SamajSebi Sangha</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Gallery Year :2024</p>
                            </div>
                            <button className='cursor-pointer py-2 w-full bg-red-600 text-white rounded hover:bg-red-700 transition'>
                                Open Gallery
                            </button>
                        </div>
                        <div className="bg-gray-100 dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-400 
                    dark:border-gray-700 cursor-pointer shadow-lg">
                            <img src="https://massart.in/wp-content/uploads/2024/11/download-66.jpg" alt="Photo" className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">SamajSebi Sangha</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Gallery Year :2023</p>
                            </div>
                            <button className='cursor-pointer py-2 w-full bg-red-600 text-white rounded hover:bg-red-700 transition'>
                                Open Gallery
                            </button>
                        </div>
                    </div>
                </div>
                <br />
            </section>
        </>
    )
}

export default CommiteePhotoGallery;