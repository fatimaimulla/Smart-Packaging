import React, { useState, useMemo } from "react";
import { Search, Filter, Plus } from "lucide-react";
import Header from "../common/Header";
import Footer from "../common/Footer";
// import LibrarySidebar from "../components/library/LibrarySidebar";
// import DielineCard from "../components/library/DielineCard";
import { useNavigate } from "react-router-dom";
import LibrarySidebar from "@/components/library/LibrarySideBar";
import DielineCard from "@/components/library/DielineCard";
import clsx from "clsx";

// --- Mock Data ---
const MOCK_DIELINES = [
  {
    id: 1,
    name: "Standard RSC Box",
    category: "folding",
    source: "system",
    image:
      "https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/f3f4f6/a1a1aa?text=RSC+Box",
    description:
      "Regular Slotted Container (FEFCO 0201). The most common shipping box type.",
    tags: ["Shipping", "Corrugated"],
    isNew: false,
  },
  {
    id: 2,
    name: "Tuck Top Snap Lock Bottom",
    category: "tuck",
    source: "system",
    image:
      "https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/f3f4f6/a1a1aa?text=Snap+Lock",
    description:
      "Secure bottom closure for heavier retail items. No glue required for bottom.",
    tags: ["Retail", "Secure"],
    isNew: true,
  },
  {
    id: 3,
    name: "Mailer Box (E-commerce)",
    category: "mailer",
    source: "system",
    image:
      "https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/f3f4f6/a1a1aa?text=Mailer+Box",
    description:
      "Self-locking mailer box perfect for subscription boxes and e-commerce.",
    tags: ["E-commerce", "Premium"],
    isNew: false,
  },
  {
    id: 4,
    name: "Custom Gift Box 2024",
    category: "folding",
    source: "user",
    image:
      "https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/e0f2fe/3b82f6?text=My+Gift+Box",
    description: "Modified RSC with custom cutout window for holiday season.",
    tags: ["Custom", "Gift"],
    isNew: false,
  },
  {
    id: 5,
    name: "Tray with Sleeve",
    category: "tray",
    source: "system",
    image:
      "https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/f3f4f6/a1a1aa?text=Tray+Sleeve",
    description: "Two-piece box consisting of a sliding tray and a sleeve.",
    tags: ["Luxury", "Retail"],
    isNew: false,
  },
  {
    id: 6,
    name: "Paper Shopping Bag",
    category: "bag",
    source: "system",
    image:
      "https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/f3f4f6/a1a1aa?text=Paper+Bag",
    description: "Standard paper bag with twisted handles template.",
    tags: ["Retail", "Eco"],
    isNew: false,
  },
  {
    id: 7,
    name: "Prototype V2",
    category: "mailer",
    source: "user",
    image:
      "https://img-wrapper.vercel.app/image?url=https://placehold.co/400x300/e0f2fe/3b82f6?text=Proto+V2",
    description: "Experimental mailer with extra padding flaps.",
    tags: ["Draft", "Test"],
    isNew: true,
  },
];

const DielineLibraryPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSource, setActiveSource] = useState(null); // 'system' | 'user' | null
  const [searchQuery, setSearchQuery] = useState("");

  // --- Filtering Logic ---
  const filteredDielines = useMemo(() => {
    return MOCK_DIELINES.filter((item) => {
      // Category Filter
      if (activeCategory !== "all" && item.category !== activeCategory)
        return false;

      // Source Filter
      if (activeSource && item.source !== activeSource) return false;

      // Search Filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [activeCategory, activeSource, searchQuery]);

  // --- Counts Logic ---
  const counts = useMemo(() => {
    const c = { all: MOCK_DIELINES.length };
    MOCK_DIELINES.forEach((d) => {
      c[d.category] = (c[d.category] || 0) + 1;
    });
    return c;
  }, []);

  const handleUseDieline = (dieline) => {
    // Navigate to generator with this template
    navigate("/dieline", {
      state: { templateId: dieline.id, name: dieline.name },
    });
  };

  const handlePreview = (dieline) => {
    console.log("Preview", dieline);
    // Could open a modal here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF] font-sans flex flex-col">
      <Header />

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-2">
                Dieline Library
              </h1>
              <p className="text-gray-600 max-w-xl">
                Browse our collection of industry-standard packaging templates
                or manage your custom designs.
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm"
                />
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>

              {/* Create New Button */}
              <button
                onClick={() => navigate("/dieline")}
                className="bg-[#0D1B2A] text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors md:hidden"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={() => navigate("/dieline")}
                className="hidden md:flex bg-[#0D1B2A] text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors items-center gap-2 font-bold"
              >
                <Plus size={18} />
                Create New
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar (3 Cols) */}
            <div className="lg:col-span-3 xl:col-span-2 hidden lg:block">
              <LibrarySidebar
                activeCategory={activeCategory}
                activeSource={activeSource}
                onSelectCategory={setActiveCategory}
                onSelectSource={setActiveSource}
                counts={counts}
              />
            </div>

            {/* Main Grid (9 Cols) */}
            <div className="lg:col-span-9 xl:col-span-10">
              {/* Mobile Filter Toggle (Visible only on small screens) */}
              <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-sm font-bold whitespace-nowrap">
                  <Filter size={14} /> Filters
                </button>
                {/* Simple category chips for mobile */}
                {["all", "folding", "mailer"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={clsx(
                      "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      activeCategory === cat
                        ? "bg-[#0D1B2A] text-white"
                        : "bg-white border border-gray-200 text-gray-600"
                    )}
                  >
                    {cat === "all"
                      ? "All"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">
                  Showing {filteredDielines.length} templates
                </span>

                {activeSource === "user" && (
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    My Creations
                  </span>
                )}
              </div>

              {/* Grid */}
              {filteredDielines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredDielines.map((dieline) => (
                    <DielineCard
                      key={dieline.id}
                      dieline={dieline}
                      onUse={handleUseDieline}
                      onPreview={handlePreview}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No dielines found
                  </h3>
                  <p className="text-gray-500 max-w-md text-center mb-6">
                    We couldn't find any templates matching your criteria. Try
                    adjusting your filters or search query.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                      setActiveSource(null);
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DielineLibraryPage;
