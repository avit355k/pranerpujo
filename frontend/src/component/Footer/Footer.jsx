import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const FooterLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="blocktext-sm font-synonym text-white/85 hover:text-white hover:translate-x-1transition-allduration-200"
    >
      {children}
    </Link>
  );
};

const FooterColumn = ({ title, children }) => {
  return (
    <div>
      <h3 className="mb-5 text-sm font-display font-semibold uppercase tracking-wider text-white ">
        {title}
      </h3>

      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative overflow-hidden min-h-125 bg-neutral-900 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat "
        style={{
          backgroundImage: "url('/footer_bg.webp')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-neutral-700/50 dark:bg-neutral-800/75" />

      {/* Top Gradient */}
      <div className="hidden dark:block absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-neutral-950/80 to-transparent" />

      {/*  CONTENT  */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-16 pb-8">
        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-12">
          {/* BRAND */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 max-w-70">
            {/* Logo */}
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.svg"
                alt="Praner Pujo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Description */}
            <p className="max-w-67.5 font-synonym text-sm leading-6 text-white/75">
              Celebrate Durga Puja like never before. Discover pandals, plan
              routes, and share your festive experiences with the community.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-white/60 hover:text-white hover:-translate-y-1 transition-all duration-200"
              >
                <FaFacebook size={21} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="text-white/60 hover:text-white hover:-translate-y-1 transition-all duration-200"
              >
                <FaTwitter size={21} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="text-white/60 hover:text-white hover:-translate-y-1 transition-all duration-200"
              >
                <FaInstagram size={21} />
              </a>

              <a
                href="#"
                aria-label="Github"
                className="text-white/60 hover:text-white hover:-translate-y-1 transition-all duration-200"
              >
                <FaGithub size={21} />
              </a>
            </div>
          </div>

          {/* EXPLORE */}
          <FooterColumn title="Explore">
            <FooterLink to="/">Map</FooterLink>
            <FooterLink to="/parikrama">Parikrama</FooterLink>
            <FooterLink to="/gallery/photos">Gallery</FooterLink>
          </FooterColumn>

          {/* PARIKRAMA */}
          <FooterColumn title="Parikrama">
            <FooterLink to="/parikrama">By Zone</FooterLink>
            <FooterLink to="/parikrama/bonedi-bari-pujas">Bonedi Bari</FooterLink>
          </FooterColumn>

          {/* ZONES */}
          <FooterColumn title="Zones">
            <FooterLink to="/parikrama/by-zone/north-kolkata">
              North Kolkata
            </FooterLink>
            <FooterLink to="/parikrama/by-zone/south-kolkata">
              South Kolkata
            </FooterLink>
            <FooterLink to="/parikrama/by-zone/north-east-city">
              North East Kolkata
            </FooterLink>
            <FooterLink to="/parikrama/by-zone/SaltLake">
              Central Kolkata
            </FooterLink>
            <FooterLink to="/parikrama/by-zone/behala">
              Behala & West Kolkata
            </FooterLink>
            <FooterLink to="/parikrama/by-zone/haridevpur">
              Haridevpur & Others
            </FooterLink>
          </FooterColumn>

          {/* DISCOVER */}
          <FooterColumn title="Discover">
            <FooterLink to="/awards">Awards</FooterLink>
            <FooterLink to="/metro">Metro</FooterLink>
          </FooterColumn>

          {/* INFORMATION */}
          <FooterColumn title="Information">
            <FooterLink to="/about">About</FooterLink>
          </FooterColumn>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-14 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-white/60">
            © {new Date().getFullYear()} Praner Pujo. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-5">
            <Link
              to="/privacy"
              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;