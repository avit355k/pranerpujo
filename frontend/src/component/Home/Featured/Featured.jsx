import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import PujaCard from "../../Pujacard/PujaCard";
import { useNavigate } from "react-router-dom";

const Featured = () => {

  return (
      <div className="relative p-10 bg-white dark:bg-black transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-600">Featured Pujas</h1>
      </div>

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
          {[...Array(10)].map((_, i) => (
            <SwiperSlide key={i}>
              <PujaCard />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom arrows with correct class names */}
        <button className="custom-prev absolute top-1/2 -left-6 z-10 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer">
          <IoChevronBack size={24} />
        </button>
        <button className="custom-next absolute top-1/2 -right-6 z-10 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer">
          <IoChevronForward size={24} />
        </button>
      </div>
    </div>
  );
};

export default Featured;

