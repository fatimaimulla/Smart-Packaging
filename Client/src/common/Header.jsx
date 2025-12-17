import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Box } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { clsx } from "clsx";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4",
        isScrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Box size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0D1B2A]">
            SmartPack
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/about"
            className="text-gray-600 hover:text-[#0D1B2A] font-medium transition-colors"
          >
            About
          </Link>
          <Link
            to="/how-it-works"
            className="text-gray-600 hover:text-[#0D1B2A] font-medium transition-colors"
          >
            How it Works
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="#"
            className="text-[#0D1B2A] font-semibold hover:text-emerald-600 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="#"
            className="bg-[#0D1B2A] text-white px-5 py-2.5 rounded-full font-medium hover:bg-emerald-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#0D1B2A]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white shadow-lg p-6 md:hidden flex flex-col gap-4 border-t border-gray-100"
        >
          <Link to="#" className="text-lg font-medium text-gray-700">
            About
          </Link>
          <Link
            to="/how-it-works"
            className="text-lg font-medium text-gray-700"
          >
            How it Works
          </Link>
          <hr className="border-gray-100" />
          <Link to="#" className="text-lg font-medium text-gray-700">
            Log In
          </Link>
          <Link to="#" className="text-lg font-medium text-emerald-600">
            Sign Up
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
