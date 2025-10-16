import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { TbVideoMinus } from "react-icons/tb";

const CommitteeVideoGallery = () => {
  const videos = [
    {
      title: "SamajSebi Sangha",
      year: 2025,
      link: "https://www.youtube.com/embed/aCdcgV_AEWQ?si=unb3P6tAtt5iJ4Gr",
    },
    {
      title: "SamajSebi Sangha",
      year: 2024,
      link: "https://www.youtube.com/embed/OegEkiaIbqw?si=RElVO070UO0IO3Y1",
    },
    {
      title: "SamajSebi Sangha",
      year: 2023,
      link: "https://www.youtube.com/embed/MxzS52rfjYE?si=_hPcWFSSGweyJ_Nb",
    },
  ];

  return (
    <section className="px-4 sm:px-8 py-10 bg-white dark:bg-black transition-colors duration-300 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-neutral-900 p-6 shadow-sm rounded-lg">
        <img
          src="https://samajsebi.com/img/logo.jpg"
          alt="committee_logo"
          className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
            SamajSebi Sangha
          </h1>
          <p className="flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            Zone <IoLocationSharp className="text-red-600 mx-1" /> South Kolkata
          </p>
        </div>
      </header>

      {/* Section Divider */}
      <div className="w-full h-1 bg-red-600 rounded my-6"></div>

      {/* Section Title */}
      <div className="flex items-center gap-2 mb-8">
        <TbVideoMinus className="text-3xl text-red-600" />
        <h2 className="text-2xl lg:text-3xl font-bold text-red-600">
          Check out latest videos
        </h2>
      </div>

      {/* Video Grid */}
      <div className="container mx-auto px-2 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-neutral-900 rounded-2xl overflow-hidden border border-gray-300 
                         dark:border-gray-700 shadow-md hover:shadow-2xl transition-all duration-300"
            >
              {/* Title */}
              <div className="bg-white dark:bg-neutral-900 text-black dark:text-white text-center py-2 font-mono font-semibold text-lg">
                {video.title}{" "}
                <span className="font-semibold text-amber-500">{video.year}</span>
              </div>

              {/* Video Frame */}
              <div className="relative w-full aspect-video">
                <iframe
                  src={video.link}
                  title={`Puja Theme Video ${video.year}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-b-2xl"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommitteeVideoGallery;
