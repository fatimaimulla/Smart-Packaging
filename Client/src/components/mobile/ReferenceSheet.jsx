import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, CreditCard, BoxSelect, Check } from "lucide-react";
import { clsx } from "clsx";

const options = [
  { id: "coin", label: "₹10 Coin", icon: Coins },
  { id: "ATM card", label: "ATM Card", icon: CreditCard },
  { id: "2x2 box", label: "2x2 Marker", icon: BoxSelect },
];

const ReferenceSheet = ({ isOpen, selected, onSelect, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

            <h2 className="text-xl font-bold text-[#0D1B2A] mb-2">
              Select Reference
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              We need a standard object for scale. Place it next to your product.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onSelect(opt.id)}
                    className={clsx(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-gray-200 bg-white text-gray-700 active:bg-gray-50"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isSelected ? "bg-emerald-200 text-emerald-700" : "bg-gray-100 text-gray-500"
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="font-semibold flex-1 text-left">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onConfirm}
              disabled={!selected}
              className="w-full py-4 bg-[#0D1B2A] text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.98] transition-transform"
            >
              Continue
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReferenceSheet;
