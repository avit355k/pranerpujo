import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import videoBg from '../../../assets/video/Durga Puja Art.mp4'

import { IoVolumeMediumOutline, IoVolumeMuteOutline } from "react-icons/io5";

const Hero = () => {
  const texts = [
    "World Biggest Art Festival",
    "Wonder of specticular art installations",
    "Join artists, creators, and dreamers in one grand celebration of art."
  ]

  const [index, setIndex] = useState(0);

  // Cycle through texts
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length)
    }, 4000) // change text every 4 seconds
    return () => clearInterval(interval)
  }, [texts.length]);

  const [isMuted, setIsMuted] = useState(true);
  const toggleSound = async () => {
    setIsMuted((prev) => !prev)
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Local Video Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={videoBg}
          autoPlay
          muted={isMuted}
          loop
          playsInline
        />
      </div>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={index} // re-animates whenever index changes
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-5xl font-light text-neutral-100 drop-shadow-lg max-w-3xl"
          >
            {texts[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent"></div>

      <button
        onClick={toggleSound}
        className="absolute z-10 bottom-2 right-2   text-white  rounded-full backdrop-blur-md cursor-pointer p-2 transition-all duration-300 hover:scale-110 hover:bg-black/30  "
      >
        {isMuted ? <IoVolumeMuteOutline /> : <IoVolumeMediumOutline />}
      </button>
    </section>
  )
}

export default Hero
