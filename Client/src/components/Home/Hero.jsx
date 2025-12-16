import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 px-6 md:px-12 min-h-[90vh] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left Column: Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-white/50 backdrop-blur-sm border border-emerald-100 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-emerald-600 font-semibold text-sm tracking-wide uppercase">
              AI-Powered Packaging
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0D1B2A] leading-[1.1] mb-6">
            Perfect Fit, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              Zero Waste.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            Instantly generate precise die-lines from simple photos. The
            eco-friendly way to dimension your packaging workflow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
              aria-label="Start a new project"
            >
              Start New Project
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/review?demo=true")}
              className="border border-gray-400 text-gray-700 rounded-full px-8 py-4 font-semibold text-lg hover:border-gray-500 transition-all flex items-center justify-center gap-2 bg-transparent"
              aria-label="Try sample demo"
            >
              <PlayCircle size={20} />
              Try Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column: Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center items-center"
        >
          {/* Floating Background Blobs */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-10 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl mix-blend-multiply"
          />

          {/* 3D Box Illustration (SVG) */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 w-full max-w-md aspect-square"
          >
            <svg
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-2xl"
            >
              {/* Box Back Faces */}
              <path
                d="M100 150 L300 150 L300 350 L100 350 Z"
                fill="#F0F9FF"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <path
                d="M100 150 L150 100 L350 100 L300 150 Z"
                fill="#E0F2FE"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <path
                d="M300 150 L350 100 L350 300 L300 350 Z"
                fill="#BAE6FD"
                stroke="#3B82F6"
                strokeWidth="2"
              />

              {/* Box Front Faces (Open Flaps) */}
              <motion.path
                initial={{ rotateX: 0 }}
                animate={{ rotateX: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                d="M100 150 L150 100 L50 100 L0 150 Z"
                fill="#FFFFFF"
                stroke="#10B981"
                strokeWidth="2"
                className="opacity-90"
              />
              <path
                d="M100 150 L100 350 L0 350 L0 150 Z"
                fill="#FFFFFF"
                stroke="#10B981"
                strokeWidth="2"
                className="opacity-90"
              />

              {/* Scan Line Effect */}
              <motion.g
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [100, 300, 100], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <line
                  x1="0"
                  y1="0"
                  x2="400"
                  y2="0"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <rect
                  x="0"
                  y="0"
                  width="400"
                  height="40"
                  fill="url(#scan-gradient)"
                />
              </motion.g>

              <defs>
                <linearGradient
                  id="scan-gradient"
                  x1="200"
                  y1="0"
                  x2="200"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#10B981" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating UI Card Overlay */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Dimensions</p>
                <p className="text-sm font-bold text-gray-800">
                  12.5" x 8.2" x 4.0"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
