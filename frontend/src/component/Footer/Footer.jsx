import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand / About Section */}
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">PranerPujo</h2>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Celebrate Durga Puja like never before. Discover pandals, plan
            routes, and share your festive experiences with the community.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.facebook.com/share/1D2pQB5dQd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 transition"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>

            <a
              href="#"
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 transition"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>

            <a
              href="https://instagram.com/pranerpujo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 transition"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="https://github.com/avit355k"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 transition"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-red-500 transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-red-500 transition">About Us</Link></li>
            <li><Link to="/parikrama" className="hover:text-red-500 transition">Parikrama</Link></li>
            <li><Link to="/schedule" className="hover:text-red-500 transition">Schedule</Link></li>
            <li><Link to="/artists" className="hover:text-red-500 transition">Artists</Link></li>
            <li><Link to="/awards" className="hover:text-red-500 transition">Awards</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-red-500 transition">FAQs</Link></li>
            <li><Link to="/privacy" className="hover:text-red-500 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-red-500 transition">Terms & Conditions</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-300 dark:border-neutral-700 mt-10 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} <span className="text-red-600 font-semibold">PranerPujo</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
