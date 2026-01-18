import React from 'react'
import { Link } from "react-router-dom";
import Hero from '../../component/Home/Hero/Hero'
import Featured from '../../component/Home/Featured/Featured'
import { motion } from "framer-motion";

const Home = () => {
  const awardLogos = [
    "https://ik.imagekit.io/avit355k/pandels/Awards/massart.png",
    "https://ik.imagekit.io/avit355k/pandels/Awards/asian_paints.png",
    "https://ik.imagekit.io/avit355k/pandels/Awards/7wonders.png",
    "https://pujoperfect.in/images/pp_scroll_head_logo.png",
    "https://www.indianfestivaldiary.com/durgapuja/awards/abp_sharad_arghya/abp_sharad_arghya.jpg",
    "https://www.bergerpriyopujo.com/images/logo.png",
    "https://images.news18.com/dlxczavtqcctuei/news18/static/images/news18bengali-logo.svg",
    "https://www.nerolac.com/SheraParaSheraPujo/images/spsp-banner-image.png",
    "https://www.indianfestivaldiary.com/durgapuja/awards/narayani_namastute/narayani_namastute.jpg",
  ];

  return (
    <>
      <Hero />
      <div className="flex flex-col md:flex-row justify-between items-center p-10 bg-white dark:bg-black transition-colors duration-300">
        {/* Left Content */}
        <motion.div
          className="md:w-3/5 space-y-4 text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl font-bold text-red-600">About Us</h1>

          <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
            The Praner Pujo is a pioneering immersive Interactive user friendly application.
            Look for arrows and tap or click them to wander around, experiencing the pandal like you are truly there.
            Enjoy the wonder of exploring each pandal from your screen!
          </p>
          <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
            Experience the finest installation art (pandals) of Kolkata's Durga Puja—acknowledged as an
            'Intangible Cultural Heritage' by UNESCO—right from your smart device. It's Completely FREE,
            Compatible with all modern browsers.
          </p>
          <Link to="/about">
            <button className="px-6 py-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition cursor-pointer">
              Read More
            </button>
          </Link>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="md:w-2/5 mt-6 md:mt-0 md:ml-10 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src="https://kenduashantisangha.org/assets/images/artist-details/2021/img-2.jpg"
            alt="Durga Puja Art"
            className="rounded-xl shadow-lg object-cover max-h-[400px]"
          />
        </motion.div>
      </div >

      {/* Awards Scroller */}
      <div className="relative w-full overflow-hidden py-10 bg-white dark:bg-black transition-colors duration-300">
        <motion.div
          className="flex space-x-16"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          }}
        >
          {[...awardLogos, ...awardLogos].map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt={`Award ${i + 1}`}
              className="h-20 w-auto object-contain"
            />
          ))}
        </motion.div>
      </div>

      <Featured />

      <div className='py-10 bg-white dark:bg-black transition-colors duration-300'>
        <h1 className='text-center text-3xl font-bold text-red-600'>Why choose PranerPujo ?</h1>
        <p className='text-center leading-relaxed text-neutral-600 dark:text-neutral-400 mb-10'>
          Everything you need to make your Durga Puja experience unforgettable
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12">
          {/* Feature 1 */}
          <motion.div
            className="text-center p-6 rounded-lg shadow-md bg-gray-50 dark:bg-neutral-900 transition"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-red-500 text-4xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
              Discover Pandals
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Browse hundreds of Puja pandals with detailed info, photos, and
              timings.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="text-center p-6 rounded-lg shadow-md bg-gray-50 dark:bg-neutral-900 transition"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-red-500 text-4xl mb-4">🧭</div>
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
              Smart Route Planning
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Create optimized routes to visit multiple pandals efficiently.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="text-center p-6 rounded-lg shadow-md bg-gray-50 dark:bg-neutral-900 transition"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-red-500 text-4xl mb-4">🚗</div>
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
              Turn-by-Turn Navigation
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Get real-time directions with live traffic updates between pandals.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            className="text-center p-6 rounded-lg shadow-md bg-gray-50 dark:bg-neutral-900 transition"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-red-500 text-4xl mb-4">📸</div>
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
              Photo Gallery
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              View stunning pandal photos and share your experience with others.
            </p>
          </motion.div>
        </div>
      </div>

    </>
  )
}

export default Home
