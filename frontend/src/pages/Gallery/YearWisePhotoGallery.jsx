import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import axios from "axios";
import { API } from "../../services/api";

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
  const { id, year } = useParams(); // ✅ Both id and year come from URL
  const [pandel, setPandel] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(-1);

  // ✅ Fetch Pandel Details
  useEffect(() => {
    const fetchPandel = async () => {
      try {
        const res = await axios.get(`${API}/api/pandel/${id}`);
        setPandel(res.data);
      } catch (err) {
        console.error("Error fetching pandel details:", err);
      }
    };
    if (id) fetchPandel();
  }, [id]);

  //get image size utility
  const getImageSize = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve({ width: img.width, height: img.height });
    });
  };

  // ✅ Fetch Year-wise Photos
useEffect(() => {
  const fetchGalleryPhotos = async () => {
    try {
      const res = await axios.get(`${API}/api/gallery/photos/${id}/${year}`);

      if (res.data?.photos?.length) {
        const formattedPhotos = await Promise.all(
          res.data.photos.map(async (src) => {
            const size = await getImageSize(src);
            return { src, ...size };
          })
        );

        setPhotos(formattedPhotos);
      } else {
        setPhotos([]);
      }
    } catch (err) {
      console.error("Error fetching gallery photos:", err);
      setPhotos([]);
    }
  };

  if (id && year) fetchGalleryPhotos();
}, [id, year]);


  if (!pandel)
    return <p className="text-center text-red-500 py-8">Loading pandel details...</p>;

  return (
    <section className="px-4 py-6 bg-white dark:bg-black transition-colors duration-300">
      {/* Header Section */}
      <div className="mb-8">
        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-50 dark:bg-black p-6 shadow-sm">
          <div className="flex-shrink-0">
            <img
              src={pandel.logo}
              alt="committee_logo"
              className="w-28 h-28 rounded-full object-cover border-4 border-red-600"
            />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
              {pandel.name}
            </h1>
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Durga Puja Photo Gallery {year}
            </p>
            <p className="flex items-center justify-center sm:justify-start text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Zone <IoLocationSharp className="text-red-600 mr-1 ml-1" /> {pandel.zone}
            </p>
          </div>
        </header>
        <div className="w-full h-1 bg-red-600 rounded"></div>
      </div>

      {/* ✅ Gallery Section */}
      <div className="overflow-hidden shadow-sm bg-gray-50 dark:bg-black p-3 sm:p-6">
        {photos.length > 0 ? (
          <>
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
          </>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 py-10">
            No photos available for {year}.
          </p>
        )}
      </div>
    </section>
  );
};

export default YearWisePhotoGallery;
