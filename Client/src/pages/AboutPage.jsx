import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Boxes,
  Compass,
  FileText,
  Layers3,
  Leaf,
  Package,
  PackagePlus,
  Ruler,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";

import Header from "@/common/Header";
import Footer from "@/common/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
};

const pillars = [
  {
    icon: Upload,
    title: "Image-led input",
    description:
      "Start from simple top and side product photos instead of manual packaging drafting.",
  },
  {
    icon: Ruler,
    title: "Measurement intelligence",
    description:
      "Use a reference object to convert pixels into real-world product dimensions.",
  },
  {
    icon: Layers3,
    title: "Packaging generation",
    description:
      "Recommend FEFCO styles, generate dielines, and preview the folded 3D box.",
  },
  {
    icon: Leaf,
    title: "Sustainability focus",
    description:
      "Reduce over-packaging and support better material use with structured reporting.",
  },
];

const capabilityBlocks = [
  {
    title: "Single-product packaging workflow",
    icon: Package,
    accent: "from-[#DDF6FF] to-[#F5FBFF]",
    border: "border-sky-200",
    bullets: [
      "Upload top and side product images with a reference object",
      "Review calculated dimensions and detected geometry",
      "Set fragility and inspect recommended packaging type",
      "Preview 2D dielines and folded 3D packaging",
      "Download production-ready outputs and reports",
    ],
  },
  {
    title: "Reusable dashboard system",
    icon: Boxes,
    accent: "from-[#EEF7FF] to-[#FBFDFF]",
    border: "border-blue-200",
    bullets: [
      "Store configured projects in one workspace",
      "Reopen editor, report, review, and simulation flows",
      "Separate product projects and bundle projects clearly",
      "Keep packaging work organized for later reuse",
    ],
  },
  {
    title: "Advanced bundle planning",
    icon: PackagePlus,
    accent: "from-[#ECFFF2] to-[#F8FFF9]",
    border: "border-emerald-200",
    bullets: [
      "Import saved configured products into one combined planner",
      "Optimize shared FEFCO packaging for multiple items",
      "Inspect layer breakdown, placement order, and 3D packing view",
      "Support practical multi-product shipping decisions",
    ],
  },
];

const impactPoints = [
  {
    icon: Target,
    title: "Reduce manual trial-and-error",
    text: "Packaging design starts from product data instead of repeated physical prototyping.",
  },
  {
    icon: ShieldCheck,
    title: "Improve packaging fit",
    text: "The system encourages safer and more appropriate box selection based on dimensions and fragility.",
  },
  {
    icon: Leaf,
    title: "Support sustainability",
    text: "Better-fit packaging helps reduce unnecessary material use and oversized shipping boxes.",
  },
  {
    icon: Sparkles,
    title: "Make packaging easier to understand",
    text: "Visual previews, reports, and bundle packing views make the workflow easier for non-experts too.",
  },
];

const AboutPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(user);

  const dashboardCta = isAuthenticated ? "/projects" : "/login";
  const bundleCta = isAuthenticated ? "/bundle-planner" : "/login";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(221,248,255,0.95),_rgba(248,252,255,1)_34%,_rgba(239,252,245,0.96)_72%,_rgba(225,238,255,0.92)_100%)]">
      <Header />

      <main className="overflow-hidden px-6 pb-20 pt-32 md:px-10">
        <div className="mx-auto max-w-7xl">
          <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/75 px-6 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm md:px-10 md:py-14">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.18),_transparent_58%)] xl:block" />

            <div className="relative grid items-center gap-12 xl:grid-cols-[1.02fr_0.98fr]">
              <motion.div
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                  <Compass size={14} />
                  About SmartPack
                </div>

                <h1 className="mt-6 text-4xl font-bold leading-tight text-[#0D1B2A] md:text-6xl">
                  A smarter way to move from{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                    product images to practical packaging decisions
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  SmartPack is a packaging assistance platform that helps users
                  estimate product dimensions from images, choose suitable packaging
                  structures, preview dielines, generate exports, and organize both
                  single-product and multi-product packaging workflows.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/how-it-works")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-7 py-4 text-base font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Explore How It Works
                    <ArrowRight size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/upload")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Start A Project
                    <Upload size={18} />
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
                className="relative"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Core idea
                    </p>
                    <p className="mt-4 text-2xl font-bold text-[#0D1B2A]">
                      Measure, recommend, preview, export
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Use image-based input to shorten the packaging design cycle.
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-[#0D1B2A] p-5 text-white shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-white/55">
                      Output focus
                    </p>
                    <p className="mt-4 text-2xl font-bold">
                      FEFCO-driven packaging workflow
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/75">
                      Support both packaging visualization and structured deliverables.
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm md:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Why this project matters
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                        Less packaging guesswork
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                        Better-fit packaging decisions
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                        Clearer sustainability reporting
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <motion.section
            {...fadeUp}
            className="mt-8 rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                Mission
              </p>
              <h2 className="mt-3 text-4xl font-bold text-[#0D1B2A]">
                Help packaging design start from the product itself
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Traditional packaging work can be slow, repetitive, and difficult to
                visualize for non-specialists. SmartPack aims to simplify that process
                by turning real product imagery into packaging-ready information,
                giving users a clearer path from physical product to digital packaging
                output.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <div
                    key={pillar.title}
                    className="rounded-[24px] border border-slate-100 bg-[#F8FBFF] p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <section className="mt-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                What The Project Includes
              </p>
              <h2 className="mt-3 text-4xl font-bold text-[#0D1B2A]">
                The system is more than one page or one output
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                SmartPack combines measurement support, packaging recommendation,
                visualization, exporting, project reuse, and bundle planning inside
                one connected workflow.
              </p>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-3">
              {capabilityBlocks.map((block) => {
                const Icon = block.icon;

                return (
                  <motion.article
                    key={block.title}
                    {...fadeUp}
                    className={`rounded-[30px] border ${block.border} bg-gradient-to-br ${block.accent} p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-[#0D1B2A]">
                      {block.title}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {block.bullets.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                        >
                          <Sparkles
                            size={15}
                            className="mt-1 shrink-0 text-emerald-600"
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>

          <motion.section
            {...fadeUp}
            className="mt-10 rounded-[34px] border border-[#CDE8DC] bg-[linear-gradient(135deg,rgba(13,27,42,0.98),rgba(7,64,74,0.96))] px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.24)] md:px-8"
          >
            <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200/80">
                  Why It Matters
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Practical packaging support with clearer decisions and better visibility
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                  The project is designed to help users understand what packaging is
                  needed, why it is recommended, and how the final packaging should
                  look before manufacturing or shipping decisions are made.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {impactPoints.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div
                      key={point.title}
                      className="rounded-[26px] border border-white/10 bg-white/8 p-5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 text-lg font-bold">{point.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/75">
                        {point.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            className="mt-10 grid gap-5 xl:grid-cols-2"
          >
            <div className="rounded-[32px] border border-blue-100 bg-white/80 p-6 shadow-[0_20px_70px_rgba(59,130,246,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
                Learn The Workflow
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[#0D1B2A]">
                See the complete product journey step by step
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Explore the full workflow page to understand how image upload,
                measurement, FEFCO recommendation, dielines, reports, and bundles all
                connect together.
              </p>
              <button
                type="button"
                onClick={() => navigate("/how-it-works")}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0D1B2A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Open How It Works
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white/80 p-6 shadow-[0_20px_70px_rgba(16,185,129,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
                Start Using The Project
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[#0D1B2A]">
                Begin with one product or jump into your saved workspace
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Start a fresh single-product project, open your dashboard, or move
                straight into the bundle planner if you are already working with saved
                configured products.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Start A Project
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={dashboardCta}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Open Dashboard
                  <Boxes size={16} />
                </Link>
                <Link
                  to={bundleCta}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Try Bundle Planner
                  <PackagePlus size={16} />
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
