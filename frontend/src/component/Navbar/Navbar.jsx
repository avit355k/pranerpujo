import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

import { IconButton } from "@mui/material";
import { FaAngleDown } from "react-icons/fa";
import { PiLampPendantFill, PiLampPendantBold, PiWaveform, PiWaveformSlash } from "react-icons/pi";
import { IoMenu, IoCloseSharp } from "react-icons/io5";

import logo from "../../assets/logo/logo.svg";

import { useMusic } from "../../context/MusicContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Map", path: "/map" },
  {
    name: "PariKrama",
    path: "/parikrama",
    sublinks: [
      {
        name: "By Zone",
        path: "/parikrama/by-zone",
        sublinks: [
          { name: "North Kolkata", path: "/parikrama/by-zone/north-kolkata" },
          { name: "South Kolkata", path: "/parikrama/by-zone/South-kolkata" },
          { name: "North East City", path: "/parikrama/by-zone/north-east-city" },
          { name: "Behala", path: "/parikrama/by-zone/behala" },
          { name: "HaridevPur & Others", path: "/parikrama/by-zone/haridevpur" },
          { name: "Central & SaltLake", path: "/parikrama/by-zone/SaltLake" },
        ],
      },
      { name: "Bonedi Bari Pujas", path: "/parikrama/bonedi-bari-pujas" },
    ],
  },
  {
    name: "Gallery",
    path: "/gallery",
    sublinks: [
      { name: "Photos", path: "/gallery/photos" },
      { name: "Videos", path: "/gallery/videos" },
    ],
  },
  { name: "Awards", path: "/awards" },
  { name: "Artist", path: "/artists" },
  { name: "Schedule", path: "/schedule" },
  { name: "About", path: "/about" },
];

const MotionLink = motion.create(Link);

const EASE_OUT_QUAD = [0.5, 1, 0.89, 1];
const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1];
const EASE_IN_QUAD = [0.11, 0, 0.5, 0];

//  DROPDOWN PANEL (frosted mega-menu, from Header)
//  Handles plain links { name, path } and groups { name, path, sublinks }

const panelVariants = {
  closed: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: EASE_IN_QUAD },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE_OUT_CUBIC },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: 10, transition: { duration: 0, delay: 0.25 } },
  open: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.06 + i * 0.035, ease: EASE_OUT_QUAD },
  }),
};

const DropdownPanel = ({ item, isOpen }) => {
  if (!item.sublinks) return null;

  return (
    <motion.div
      className="absolute left-1/2 top-full z-40 mt-3 w-max min-w-75 max-w-140 -translate-x-1/2 rounded-3xl border border-black/10 bg-white/95 p-2 opacity-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 [-webkit-backdrop-filter:blur(24px)_saturate(150%)] dark:border-white/15 dark:bg-neutral-900/90"
      style={{ pointerEvents: isOpen ? "auto" : "none", isolation: "isolate" }}
      variants={panelVariants}
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2">
        {item.sublinks.map((sub, i) =>
          sub.sublinks ? (
            <motion.div key={sub.name} custom={i} variants={itemVariants}>
              <Link
                to={sub.path}
                className="mb-2 block px-3 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {sub.name}
              </Link>
              <div className="grid grid-cols-1 gap-0.5">
                {sub.sublinks.map((s2) => (
                  <Link
                    key={s2.name}
                    to={s2.path}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-neutral-800 transition-all duration-150 hover:translate-x-0.5 hover:bg-black/5 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    {s2.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : (
            <MotionLink
              key={sub.name}
              custom={i}
              variants={itemVariants}
              to={sub.path}
              className="block h-fit self-start rounded-xl px-3 py-2.5 text-[15px] font-semibold text-slate-800 transition-all duration-150 hover:translate-x-0.5 hover:bg-black/5 hover:text-slate-950 dark:text-slate-100 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {sub.name}
            </MotionLink>
          )
        )}
      </div>
    </motion.div>
  );
};

//  MOBILE MENU (flat list, scroll lock, Escape to close — from Header)
const flatLinks = [];
navLinks.forEach((item) => {
  flatLinks.push({ name: item.name, path: item.path, level: 0 });
  item.sublinks?.forEach((sub) => {
    flatLinks.push({ name: sub.name, path: sub.path, level: 1 });
    sub.sublinks?.forEach((nested) =>
      flatLinks.push({ name: nested.name, path: nested.path, level: 2 })
    );
  });
});

const MobileMenu = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-x-0 top-18 z-50 max-h-[calc(100vh-5rem)] overflow-hidden bg-white/95 text-neutral-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] backdrop-blur-2xl dark:bg-neutral-900/90 dark:text-white md:hidden"
          style={{ WebkitBackdropFilter: "blur(24px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25, ease: EASE_OUT_QUAD } }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_IN_QUAD } }}
        >
          <motion.div
            className="max-h-[calc(100vh-5rem)] overflow-y-auto px-5 py-5"
            initial={{ y: -15, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.35, delay: 0.15, ease: EASE_OUT_CUBIC },
            }}
          >
            <nav>
              <ul className="space-y-1.5">
                {flatLinks.map((item, index) => {
                  const active = pathname.toLowerCase() === item.path.toLowerCase();
                  return (
                    <motion.li
                      key={`${item.path}-${index}`}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        transition: {
                          duration: 0.3,
                          delay: 0.3 + index * 0.025,
                          ease: EASE_OUT_QUAD,
                        },
                      }}
                    >
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 text-[16px] transition-all duration-200 hover:translate-x-1 hover:border-black/10 hover:bg-black/5 active:scale-[0.99] dark:hover:border-white/10 dark:hover:bg-white/10
                          ${active
                            ? "text-red-600 dark:text-red-500"
                            : item.level === 0
                              ? "font-semibold text-slate-900 dark:text-white"
                              : "font-medium text-slate-600 dark:text-slate-300"
                          }
                          ${item.level === 1 ? "ml-3" : ""}
                          ${item.level === 2 ? "ml-6" : ""}`}
                      >
                        <span>{item.name}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 dark:bg-slate-500" />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

//  NAVBAR
const Navbar = () => {
  const { pathname } = useLocation();
  const { isPlaying, toggleMusic, } = useMusic();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // close dropdown / mobile menu on navigation
  useEffect(() => {
    setOpenIndex(null);
    setMobileOpen(false);
  }, [pathname]);

  // Scroll-scrubbed glass (same values as Header, over the first 300px).
  // Both light and dark sets always exist so hooks stay stable.
  const { scrollY } = useScroll();
  const range = [0, 300];

  const bgLight = useTransform(scrollY, range, ["rgba(0, 0, 0, 0)", "rgba(255, 255, 255, 0.75)"]);
  const bgDark = useTransform(scrollY, range, ["rgba(0, 0, 0, 0)", "rgba(23, 23, 23, 0.65)"]);
  const borderLight = useTransform(scrollY, range, ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.1)"]);
  const borderDark = useTransform(scrollY, range, ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.15)"]);
  const blur = useTransform(scrollY, range, ["blur(0px)", "blur(12px)"]);
  const padTop = useTransform(scrollY, range, ["0.75rem", "0.2rem"]);
  const padBottom = useTransform(scrollY, range, ["0.75rem", "0.2rem"]);

  const handleEnter = (idx) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenIndex(idx);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenIndex(null), 120);
  };

  const isActive = (p) =>
    p === "/" ? pathname === "/" : pathname.toLowerCase().startsWith(p.toLowerCase());

  const themeButton = (
    <IconButton onClick={() => setDarkMode((d) => !d)} color="inherit" aria-label="Toggle dark mode" >
      {darkMode ? < PiLampPendantFill className="text-yellow-400" /> : <PiLampPendantBold className="text-slate-700" />}
    </IconButton>
  );

  const audioButton = (
    <IconButton onClick={toggleMusic} color="inherit" aria-label={isPlaying ? "Mute music" : "Play music"} title={isPlaying ? "Pause music" : "Play music"}>
      {isPlaying ? (
        <PiWaveform className="text-red-500" />
      ) : (
        <PiWaveformSlash className="text-red-500" />
      )}
    </IconButton>
  )

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
        style={{
          backgroundColor: darkMode ? bgDark : bgLight,
          borderBottomColor: darkMode ? borderDark : borderLight,
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          backdropFilter: blur,
          WebkitBackdropFilter: blur,
          paddingTop: padTop,
          paddingBottom: padBottom,
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center">
            <img src={logo} alt="Praner Pujo Logo" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1 font-medium">
              {navLinks.map((link, idx) => (
                <li
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.sublinks && handleEnter(idx)}
                  onMouseLeave={() => link.sublinks && handleLeave()}
                >
                  <Link
                    to={link.path}
                    className={`font-synonym font-medium flex items-center gap-1 rounded-full px-4 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${isActive(link.path)
                      ? "text-red-600 dark:text-red-500"
                      : "text-slate-700 dark:text-white"
                      }`}
                  >
                    {link.name}
                    {link.sublinks && (
                      <motion.span
                        className="mt-px flex opacity-60"
                        initial={false}
                        animate={{ rotate: openIndex === idx ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT_QUAD }}
                      >
                        <FaAngleDown size={13} />
                      </motion.span>
                    )}
                  </Link>
                  {link.sublinks && <DropdownPanel item={link} isOpen={openIndex === idx} />}
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {themeButton}
            {audioButton}
            <IconButton
              className="md:hidden!"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <IoCloseSharp className="text-gray-700 dark:text-white" />
              ) : (
                <IoMenu className="text-gray-700 dark:text-white" />
              )}
            </IconButton>
          </div>
        </div>
      </motion.nav>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Navbar;