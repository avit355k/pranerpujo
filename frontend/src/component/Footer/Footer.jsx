import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 py-10  transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand / About */}
        <div>
          <h2 className="text-xl font-bold text-red-600">PranerPujo</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Celebrate Durga Puja like never before. Discover pandals, plan
            routes, and share your festive experiences with the community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-red-500">Home</a></li>
            <li><a href="/about" className="hover:text-red-500">About Us</a></li>
            <li><a href="/features" className="hover:text-red-500">Features</a></li>
            <li><a href="/contact" className="hover:text-red-500">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-red-500">FAQs</a></li>
            <li><a href="/privacy" className="hover:text-red-500">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-red-500">Terms & Conditions</a></li>
          </ul>
        </div>

     
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-300 dark:border-neutral-700 mt-10 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} PranerPujo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
