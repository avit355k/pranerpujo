import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const YearWisePhotoGallery = () => {
  const { clubId, year } = useParams();
  const [index, setIndex] = useState(-1);

  const photos = [
    { src: "https://massart.in/wp-content/uploads/2024/11/download-66.jpg", width: 1000, height: 665 },
    { src: "https://massart.in/wp-content/uploads/2024/11/Suparna_3.jpg", width: 1000, height: 665 },
    { src: "https://massart.in/wp-content/uploads/2024/11/WDW_7524-1-scaled.jpg", width: 1000, height: 665 },
    { src: "https://massart.in/wp-content/uploads/2024/11/download-55.jpg", width: 1000, height: 665 },
    { src: "https://massart.in/wp-content/uploads/2024/07/sb-park.jpg", width: 1000, height: 665 },
    { src: "https://massart.in/wp-content/uploads/2024/11/download-65.jpg", width: 1000, height: 665 },
    { src: "https://massart.in/wp-content/uploads/2024/11/BPN00159-1-scaled.jpg", width: 1000, height: 665},
    { src: "https://massart.in/wp-content/uploads/2024/11/DSC0188-1-scaled.jpg", width: 1000, height: 665 },
    { src: "https://massart.in/wp-content/uploads/2024/11/SurajitDutta_01.jpg", width: 1000, height: 665},
    { src: "https://massart.in/wp-content/uploads/2024/11/AM1_4437-scaled.jpg", width: 1000, height: 665 },
  ];

  return (
    <section className="px-4 py-6 bg-white dark:bg-black transition-colors duration-300">
      <div className="mb-8">
        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-black p-6 shadow-sm">
          <div className="flex-shrink-0">
            <img
              src="https://samajsebi.com/img/logo.jpg"
              alt="committee_logo"
              className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
            />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">SamajSebi Sangha</h1>
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Durga Puja Photo Gallery {year}
            </p>
            <p className="flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Zone <IoLocationSharp className="text-red-600 mr-1 ml-1" /> South Kolkata
            </p>
          </div>
        </header>
        <div className="w-full h-1 bg-red-600 rounded"></div>
      </div>

      <div className=" overflow-hidden shadow-sm bg-gray-50 dark:bg-black p-3 sm:p-6">
        <RowsPhotoAlbum
          photos={photos}
          targetRowHeight={250}
          spacing={20}
          onClick={({ index }) => setIndex(index)}
        />

        <Lightbox
          slides={photos}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        />
      </div>
    </section>
  );
};

export default YearWisePhotoGallery;
