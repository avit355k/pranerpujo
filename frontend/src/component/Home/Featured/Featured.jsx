import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import PujaCard from "../../Pujacard/PujaCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Featured = () => {

  const [heritagePandels, setHeritagePandels] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch heritage pandels from backend
  useEffect(() => {
    const fetchHeritagePandels = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pandel/heritage");
        setHeritagePandels(res.data || []);
      } catch (err) {
        console.error("Error fetching heritage pandels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeritagePandels();
  }, []);

  return (
      <div className="relative p-10 bg-white dark:bg-black transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600">Featured Pujas</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading featured pujas...</p>
      ) : heritagePandels.length === 0 ? (
        <p className="text-center text-gray-500">No heritage pujas found.</p>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {heritagePandels.map((pandel) => (
              <SwiperSlide key={pandel._id}>
                <PujaCard pandel={pandel} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <button className="custom-prev absolute top-1/2 -left-6 z-10 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer">
            <IoChevronBack size={24} />
          </button>
          <button className="custom-next absolute top-1/2 -right-6 z-10 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer">
            <IoChevronForward size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Featured;

