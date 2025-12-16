import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-gray-500">
          © 2025 Smart Packaging Assistant. All rights reserved.
        </div>

        <div className="flex gap-8">
          <Link
            to="#"
            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            FAQ
          </Link>
          <Link
            to="#"
            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="#"
            className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
