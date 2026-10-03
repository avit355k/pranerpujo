import { motion } from "motion/react";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import PujaCard from "../../Pujacard/PujaCard";

import axios from "axios";
import { API } from "../../../services/api";
import SkeletonCard from "../../Loading/SkeletonCard";

const Featured = () => {

  const [heritagePandels, setHeritagePandels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch heritage pandels from backend
  useEffect(() => {
    const fetchHeritagePandels = async () => {
      try {
        const res = await axios.get(`${API}/api/pandel/heritage`);
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
    // Background wrapper stays static so the gradient blend never flickers
    <div className="relative p-10 bg-linear-to-b from-neutral-100 to-white dark:from-zinc-800 dark:to-black transition-colors duration-300">

      {/* Heading: slides in from the left, red underline grows */}
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl font-bold text-red-600"
        >
          Popular Pujas
        </motion.h1>
      </div>

      {loading ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {[1, 2, 3].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </motion.div>
      ) : heritagePandels.length === 0 ? (
        <p className="text-center text-gray-500">No Popular pujas found.</p>
      ) : (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
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
            {heritagePandels.map((pandel, index) => (
              <SwiperSlide key={pandel._id}>
                {/* Cards pop in one after another (stagger resets every 4 cards) */}
                <motion.div
                  initial={{ opacity: 0, y: 28, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: (index % 4) * 0.12,
                    ease: "easeOut",
                  }}

                >
                  <PujaCard pandel={pandel} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="custom-prev absolute top-1/2 -left-6 z-10 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer"
          >
            <IoChevronBack size={24} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="custom-next absolute top-1/2 -right-6 z-10 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer"
          >
            <IoChevronForward size={24} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Featured;