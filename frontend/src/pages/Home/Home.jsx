import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Marquee from "react-fast-marquee";

import Hero from '../../component/Home/Hero/Hero'
import Featured from '../../component/Home/Featured/Featured'

import { RiCameraAiLine, RiCompassDiscoverFill } from "react-icons/ri";
import { FaLocationCrosshairs, FaCarSide } from "react-icons/fa6";

const FESTIVAL_DAYS = [
  { label: "Mahalaya", greeting: "Subho Mahalaya 🙏🏻", date: "2026-10-10", display: "10 October 2026" },
  { label: "Maha Panchami", greeting: "Maha Panchami 🪷", date: "2026-10-16", display: "16 October 2026" },
  { label: "Maha Shashthi", greeting: "Maha Shashthi 🪷", date: "2026-10-17", display: "17 October 2026" },
  { label: "Maha Saptami", greeting: "Maha Saptami 🪷", date: "2026-10-18", display: "18 October 2026" },
  { label: "Maha Ashtami", greeting: "Maha Ashtami 🪷", date: "2026-10-19", display: "19 October 2026" },
  { label: "Maha Navami", greeting: "Maha Navami 🪷", date: "2026-10-20", display: "20 October 2026" },
  { label: "Bijoya Dashami", greeting: "Shubho Bijoya Dashami 🪷", date: "2026-10-21", display: "21 October 2026" },
];

// Today's date in IST as "YYYY-MM-DD"
const getTodayIST = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

const Home = () => {

  const targetDate = new Date("2026-10-17T00:00:00+05:30").getTime();

  const calculateCountdown = () => {
    const difference = targetDate - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isOver: true,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isOver: false,
    };
  };

  const [countdown, setCountdown] = useState(calculateCountdown);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Recalculated every second (state updates above trigger a re-render)
  // To test: const todayKey = "2026-10-19";
  const todayKey = getTodayIST();
  const todayFestival = FESTIVAL_DAYS.find((d) => d.date === todayKey);
  const isAfterPuja = todayKey > FESTIVAL_DAYS[FESTIVAL_DAYS.length - 1].date;

  return (
    <>
      <Hero />
      {/* small about section */}
      <div className="flex flex-col md:flex-row justify-between items-center p-10 bg-linear-to-b from-white/50 to-neutral-100 dark:from-black dark:to-neutral-800 transition-colors duration-300">
        {/* Left Content */}
        <motion.div
          className="md:w-3/5 space-y-4 text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-display font-bold text-red-600">About Us</h1>

          <p className="leading-relaxed text-neutral-600 dark:text-neutral-400 font-synonym italic">
            Praner Pujo is a pioneering immersive and interactive user-friendly application.
            Simply look for the arrows and tap or click to wander around, experiencing the pandal as
            if you were truly there. Enjoy the wonder of exploring each pandal right from your screen!
          </p>
          <p className="leading-relaxed text-neutral-600 dark:text-neutral-400 font-synonym italic">
            Experience the finest installation art (pandals) of
            Kolkata's Durga Puja—recognized as an
            'Intangible Cultural Heritage' by UNESCO—directly from your
            smart device. The app is completely FREE and compatible with
            all modern browsers, making the magic of Durga Puja accessible
            anytime, anywhere.
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
            src="/hero.webp"
            alt="Durga Puja Art"
            className="rounded-xl shadow-lg object-cover max-h-[400px]"
          />
        </motion.div>

      </div >

      {/* Durga Puja 2026 Countdown */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative overflow-hidden
              bg-linear-to-b from-neutral-100 via-neutral-300 to-neutral-100
            dark:from-neutral-800 dark:via-neutral-900 dark:to-zinc-800
              px-4 py-8 transition-colors duration-300"
      >
        {/* Decorative background circles */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-neutral-400/40 dark:bg-neutral-500/20 blur-3xl"
        />

        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-neutral-500/30 dark:bg-zinc-400/2 blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-block rounded-full border border-neutral-400/60 dark:border-neutral-600/70 bg-white/60 dark:bg-white/5
             px-5 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-700 dark:text-neutral-200 backdrop-blur-md"
          >
            The Celebration Awaits
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-4 text-3xl font-extrabold font-typograph text-neutral-900 dark:text-neutral-50 sm:text-4xl md:text-6xl"
          >
            <span className="text-red-600">Maa Aasche!</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-base leading-relaxed font-synonym text-neutral-700 dark:text-neutral-300 sm:text-lg"
          >
            The dhak is calling, the lights are coming alive, and
            Maa Durga is on her way. Get ready to explore the magic
            of Kolkata's pandals!
          </motion.p>

          {countdown.isOver ? (
            <motion.div
              key={todayFestival?.date ?? "after"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-neutral-300/80 dark:border-neutral-700/80 bg-white/70 dark:bg-neutral-800/60 px-6 py-8 text-2xl sm:text-4xl font-bold text-neutral-900 dark:text-white backdrop-blur-md"
            >
              {todayFestival
                ? todayFestival.greeting
                : isAfterPuja
                  ? "Shubho Bijoya! See you next year 🌺"
                  : "Shubho Durga Puja! 🪷"}
            </motion.div>
          ) : (
            <>
              {/* Mahalaya greeting appears during the countdown on 10 Oct */}
              {todayFestival && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto mb-6 max-w-md rounded-2xl border border-red-600/40 bg-red-600/10 px-6 py-4 text-xl font-bold text-red-600"
                >
                  {todayFestival.greeting}
                </motion.div>
              )}

              <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                {[
                  { label: "Days", value: countdown.days },
                  { label: "Hours", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Seconds", value: countdown.seconds },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.12,
                    }}
                    whileHover={{ y: -6, scale: 1.04 }}
                    className="rounded-2xl border border-white/20 dark:border-neutral-700/80 bg-white/10 dark:bg-neutral-800/60 
                                         backdrop-blur-md shadow-xl px-3 py-6 sm:py-8 transition-colors"
                  >
                    <motion.div
                      key={item.value}
                      initial={{ opacity: 0.5, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-4xl font-black tabular-nums text-neutral-900 dark:text-white sm:text-5xl md:text-6xl"
                    >
                      {String(item.value).padStart(2, "0")}
                    </motion.div>

                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]  text-neutral-600 dark:text-neutral-400 sm:text-sm">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10"
          >
            <Link to="/map">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-neutral-900 dark:bg-neutral-100 px-7 py-3.5 font-bold  text-white dark:text-neutral-900 shadow-lg transition-colors hover:bg-neutral-700 dark:hover:bg-white"
              >
                Explore Pandals
                <span aria-hidden="true">→</span>
              </motion.span>
            </Link>
          </motion.div>

          {/* Scrolling marquee with all festival dates */}
          <div className="mt-8 overflow-hidden rounded-full border border-neutral-400/50 dark:border-neutral-600/60 bg-white/50 dark:bg-white/5 py-2 backdrop-blur-md">
            <Marquee speed={40} pauseOnHover autoFill>
              {FESTIVAL_DAYS.map((d) => (
                <span
                  key={d.date}
                  className={`pr-12 text-sm font-semibold ${d.date === todayKey
                    ? "text-red-600"
                    : "text-neutral-600 dark:text-neutral-400"
                    }`}
                >
                  🪷 {d.label} · {d.display}
                </span>
              ))}
            </Marquee>
          </div>
        </div>
      </motion.section>

      <Featured />

      <div className='py-10 bg-white dark:bg-black transition-colors duration-300'>
        <h1 className='text-center text-3xl font-bold text-red-600 font-display'>Why choose PranerPujo ?</h1>
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
            <div className="text-red-500 text-4xl mb-4 flex items-center justify-center">
              <RiCompassDiscoverFill className='text-red-500 dark:text-white' />
            </div>
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
            <div className="text-4xl mb-4 text-center flex items-center justify-center">
              <FaLocationCrosshairs className='text-red-500 dark:text-white' />
            </div>
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
            <div className="text-red-500 text-4xl mb-4 flex items-center justify-center">
              <FaCarSide className='text-red-500 dark:text-white' />
            </div>
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
            <div className="text-red-500 text-4xl mb-4 flex items-center justify-center">
              <RiCameraAiLine className='text-red-500 dark:text-white' />
            </div>
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
