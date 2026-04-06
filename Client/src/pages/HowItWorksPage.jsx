import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Compass,
  FileText,
  Layers3,
  Package,
  PackagePlus,
  Ruler,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { useSelector } from "react-redux";

import Header from "@/common/Header";
import Footer from "@/common/Footer";

const flowModules = [
  {
    step: "01",
    title: "Upload Images",
    subtitle: "Capture the product from top and side with a known reference object.",
    accent: "from-[#D8F3FF] to-[#EEF8FF]",
    border: "border-sky-200",
    icon: Upload,
    side: "left",
    provides: [
      "Top-view product image",
      "Side-view product image",
      "Reference object such as a coin",
    ],
    generates: [
      "Validated image pair",
      "Reference-aware detection setup",
      "Project session ready for review",
    ],
    ctaLabel: "Start Single Product",
    ctaTo: "/upload",
    preview: "upload",
  },
  {
    step: "02",
    title: "Dimension Calculation",
    subtitle: "Convert detected pixels into real measurements with traceable accuracy.",
    accent: "from-[#EFF7FF] to-[#E6F4FF]",
    border: "border-blue-200",
    icon: Ruler,
    side: "right",
    provides: [
      "Detected product outline",
      "Reference object size",
      "Top and side geometry",
    ],
    generates: [
      "Length, width, and height",
      "Pixel-to-metric reasoning",
      "Measurement confidence view",
    ],
    ctaLabel: "View Review Flow",
    ctaTo: "/upload",
    preview: "measurement",
  },
  {
    step: "03",
    title: "Fragility + FEFCO Selection",
    subtitle: "Match the product’s handling needs with the most suitable packaging family.",
    accent: "from-[#ECFFF2] to-[#F4FFF8]",
    border: "border-emerald-200",
    icon: ShieldCheck,
    side: "left",
    provides: [
      "Measured dimensions",
      "Fragility level",
      "Packaging constraints",
    ],
    generates: [
      "Recommended FEFCO type",
      "Packaging suitability logic",
      "Safer box decision path",
    ],
    ctaLabel: "Go To Template View",
    ctaTo: "/upload",
    preview: "fefco",
  },
  {
    step: "04",
    title: "2D Dieline + 3D Fold Preview",
    subtitle: "Inspect the packaging as a flat dieline and as a folded box before export.",
    accent: "from-[#F6F0FF] to-[#FBF7FF]",
    border: "border-violet-200",
    icon: Layers3,
    side: "right",
    provides: [
      "Chosen FEFCO dimensions",
      "Recommended template",
      "Internal box geometry",
    ],
    generates: [
      "2D dieline canvas",
      "Foldable 3D box preview",
      "Editor-ready packaging model",
    ],
    ctaLabel: "Open Dieline Editor",
    ctaTo: "/dieline-library",
    preview: "dieline",
  },
  {
    step: "05",
    title: "Reports + DXF Download",
    subtitle: "Export production-ready files and sustainability-focused reporting from the same workflow.",
    accent: "from-[#FFF7E7] to-[#FFFDF5]",
    border: "border-amber-200",
    icon: FileText,
    side: "left",
    provides: [
      "Final dimensions",
      "Selected template",
      "Material and weight context",
    ],
    generates: [
      "DXF-ready dieline export",
      "Project impact summary",
      "Report for review and sharing",
    ],
    ctaLabel: "See Project Reports",
    ctaTo: "/projects",
    preview: "report",
  },
  {
    step: "06",
    title: "Saved Projects + Bundle Planner",
    subtitle: "Reuse configured projects later and combine multiple products into a shared shipping box.",
    accent: "from-[#EEF7F3] to-[#F7FFFB]",
    border: "border-teal-200",
    icon: PackagePlus,
    side: "right",
    provides: [
      "Saved single-product projects",
      "Known dimensions, weight, fragility",
      "Quantities for bundle planning",
    ],
    generates: [
      "Reusable dashboard projects",
      "Combined FEFCO bundles",
      "Layer breakdown and packing guide",
    ],
    ctaLabel: "Try Bundle Planner",
    ctaTo: "/bundle-planner",
    preview: "bundle",
  },
];

const knowledgeStrip = [
  {
    icon: ScanSearch,
    title: "Image Pair",
    description: "Top and side views create the foundation for measurement.",
  },
  {
    icon: Compass,
    title: "Reference Object",
    description: "A known object anchors pixel measurements to real units.",
  },
  {
    icon: ShieldCheck,
    title: "Fragility Logic",
    description: "Packaging selection changes with handling sensitivity.",
  },
  {
    icon: Sparkles,
    title: "Template Logic",
    description: "The system recommends the best packaging format before export.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
};

const FlowConnector = ({ side }) => (
  <div
    className={`pointer-events-none absolute top-1/2 hidden h-px w-16 -translate-y-1/2 bg-gradient-to-r from-slate-300 to-transparent xl:block ${
      side === "left" ? "right-[-64px]" : "left-[-64px] rotate-180"
    }`}
  >
    <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-slate-400 bg-white" />
  </div>
);

const PreviewUpload = () => (
  <div className="grid grid-cols-2 gap-3">
    {["Top View", "Side View"].map((label) => (
      <div
        key={label}
        className="rounded-[22px] border border-dashed border-slate-300 bg-white px-4 py-5"
      >
        <div className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <div className="flex h-28 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <Upload size={28} />
        </div>
      </div>
    ))}
    <div className="col-span-2 rounded-[22px] bg-[#0D1B2A] px-4 py-4 text-sm font-medium text-white">
      Include a reference object in both images for accurate measurement.
    </div>
  </div>
);

const PreviewMeasurement = () => (
  <div className="rounded-[24px] border border-blue-100 bg-white p-4">
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 rounded-2xl bg-blue-50" />
      <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Pixel Metric Calculation
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-700">
          240.6 x 75.7 x 84.6 mm
        </p>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-500">
      <div className="rounded-2xl bg-slate-50 px-3 py-3">Top view ratio</div>
      <div className="rounded-2xl bg-slate-50 px-3 py-3">Reference scale</div>
      <div className="rounded-2xl bg-slate-50 px-3 py-3">Side view ratio</div>
    </div>
  </div>
);

const PreviewFefco = () => (
  <div className="grid grid-cols-2 gap-3">
    <div className="rounded-[22px] bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        Fragility
      </p>
      <div className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
        Low
      </div>
    </div>
    <div className="rounded-[22px] bg-[#0D1B2A] p-4 text-white">
      <p className="text-xs font-bold uppercase tracking-wide text-white/60">
        Recommended FEFCO
      </p>
      <p className="mt-3 text-3xl font-bold">0301</p>
    </div>
    <div className="col-span-2 rounded-[22px] bg-white px-4 py-4 text-sm text-slate-600">
      The recommendation balances geometry, fragility, and structural fit before packaging export.
    </div>
  </div>
);

const PreviewDieline = () => (
  <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
    <div className="rounded-[22px] border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        2D Dieline
      </p>
      <div className="mt-4 h-36 rounded-2xl bg-[linear-gradient(135deg,#f8fafc_25%,#e2e8f0_25%,#e2e8f0_50%,#f8fafc_50%,#f8fafc_75%,#e2e8f0_75%,#e2e8f0_100%)] bg-[length:18px_18px]" />
    </div>
    <div className="rounded-[22px] border border-slate-200 bg-[#0D1B2A] p-4 text-white">
      <p className="text-xs font-bold uppercase tracking-wide text-white/60">
        3D Fold
      </p>
      <div className="mt-4 flex h-36 items-center justify-center rounded-2xl bg-white/5">
        <div className="h-20 w-28 rounded-md border border-white/40 bg-emerald-300/10 shadow-[24px_16px_0_-8px_rgba(255,255,255,0.18)]" />
      </div>
    </div>
  </div>
);

const PreviewReport = () => (
  <div className="grid gap-3 md:grid-cols-[0.95fr_1.05fr]">
    <div className="rounded-[22px] border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        Download
      </p>
      <div className="mt-4 space-y-2">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          DXF Export
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          PDF Summary
        </div>
      </div>
    </div>
    <div className="rounded-[22px] border border-amber-100 bg-amber-50/80 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-amber-700/70">
        Sustainability Report
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-slate-600">
          Material use
        </div>
        <div className="rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-slate-600">
          Board area
        </div>
        <div className="rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-slate-600">
          Weight
        </div>
        <div className="rounded-2xl bg-white px-3 py-3 text-xs font-semibold text-slate-600">
          Impact summary
        </div>
      </div>
    </div>
  </div>
);

const PreviewBundle = () => (
  <div className="grid gap-3">
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-[22px] border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Dashboard Reuse
        </p>
        <div className="mt-4 h-24 rounded-2xl bg-slate-50" />
      </div>
      <div className="rounded-[22px] border border-slate-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Bundle Planner
        </p>
        <div className="mt-4 h-24 rounded-2xl bg-slate-50" />
      </div>
    </div>
    <div className="rounded-[22px] bg-[#0D1B2A] px-4 py-4 text-sm text-white">
      Combine configured products, generate a shared FEFCO box, and inspect the layer-by-layer packing view.
    </div>
  </div>
);

const previewMap = {
  upload: <PreviewUpload />,
  measurement: <PreviewMeasurement />,
  fefco: <PreviewFefco />,
  dieline: <PreviewDieline />,
  report: <PreviewReport />,
  bundle: <PreviewBundle />,
};

const ModuleCard = ({ module, isAuthenticated }) => {
  const Icon = module.icon;
  const cardButtonLabel =
    module.ctaTo === "/projects" && !isAuthenticated
      ? "Log in for Dashboard"
      : module.ctaLabel;

  return (
    <motion.article
      {...fadeUp}
      className={`relative overflow-hidden rounded-[30px] border ${module.border} bg-gradient-to-br ${module.accent} p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]`}
    >
      <FlowConnector side={module.side} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.26em] text-slate-500">
            Step {module.step}
          </div>
          <h3 className="mt-4 text-2xl font-bold text-[#0D1B2A]">
            {module.title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {module.subtitle}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-5 rounded-[26px] border border-white/70 bg-white/80 p-4 shadow-sm">
        {previewMap[module.preview]}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] bg-white/70 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            What user provides
          </p>
          <div className="mt-3 space-y-2">
            {module.provides.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-[#0D1B2A] p-4 text-white">
          <p className="text-xs font-bold uppercase tracking-wide text-white/55">
            What system generates
          </p>
          <div className="mt-3 space-y-2">
            {module.generates.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 text-sm text-white/85"
              >
                <Sparkles size={15} className="mt-0.5 shrink-0 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        to={module.ctaTo}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0D1B2A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
      >
        {cardButtonLabel}
        <ArrowRight size={16} />
      </Link>
    </motion.article>
  );
};

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = Boolean(user);

  const dashboardCta = isAuthenticated ? "/projects" : "/login";
  const bundleCta = isAuthenticated ? "/bundle-planner" : "/login";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(221,248,255,0.95),_rgba(248,252,255,1)_36%,_rgba(238,251,244,0.96)_72%,_rgba(223,237,255,0.92)_100%)]">
      <Header />

      <main className="overflow-hidden px-6 pb-20 pt-32 md:px-10">
        <div className="mx-auto max-w-7xl">
          <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/75 px-6 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm md:px-10 md:py-14">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.18),_transparent_58%)] xl:block" />

            <div className="relative grid items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
              <motion.div
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                  <Package size={14} />
                  Product Workflow Explained
                </div>

                <h1 className="mt-6 text-4xl font-bold leading-tight text-[#0D1B2A] md:text-6xl">
                  How Smart Packaging Works from{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                    two photos to a production-ready box
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  Upload a top image and side image with a reference object, let the
                  system calculate dimensions, choose the right FEFCO format, preview
                  the dieline in 2D and 3D, then export the files and reports you need.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/upload")}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-7 py-4 text-base font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Start Single Product
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(bundleCta)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Try Bundle Planner
                    <Boxes size={18} />
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
                className="relative"
              >
                <div className="rounded-[32px] border border-slate-200 bg-[#0D1B2A] p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[26px] bg-white/8 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-white/55">
                        Inputs
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl bg-white/8 px-4 py-3">Top image</div>
                        <div className="rounded-2xl bg-white/8 px-4 py-3">Side image</div>
                        <div className="rounded-2xl bg-white/8 px-4 py-3">
                          Reference object
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[26px] bg-white p-4 text-slate-900">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Outputs
                      </p>
                      <div className="mt-4 grid gap-3">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold">
                          Measurements
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold">
                          FEFCO Recommendation
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold">
                          Dieline + DXF + Report
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[26px] bg-gradient-to-r from-emerald-400 to-blue-500 px-5 py-4 text-[#0D1B2A]">
                    <p className="text-sm font-bold uppercase tracking-[0.18em]">
                      Full Workflow
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      Measure, recommend, preview, simulate, export, and reuse.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <motion.section
            {...fadeUp}
            className="mt-8 rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                  What The System Uses
                </p>
                <h2 className="mt-2 text-3xl font-bold text-[#0D1B2A]">
                  The inputs and logic behind the packaging output
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Every output depends on a few core signals: the image pair, the
                reference object, the measured geometry, fragility handling, and the
                final template decision.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {knowledgeStrip.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-slate-100 bg-[#F8FBFF] p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <section className="mt-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                Workflow Map
              </p>
              <h2 className="mt-3 text-4xl font-bold text-[#0D1B2A]">
                One connected process from image capture to packaging output
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                This page follows the actual product flow already available in the app,
                with the advanced multi-product bundle system shown as the next stage
                after single-product configuration.
              </p>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
              {flowModules.map((module) => (
                <div
                  key={module.step}
                  className={module.side === "left" ? "xl:pr-8" : "xl:pl-8 xl:pt-20"}
                >
                  <ModuleCard
                    module={module}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              ))}
            </div>
          </section>

          <motion.section
            {...fadeUp}
            className="mt-10 rounded-[34px] border border-[#CDE8DC] bg-[linear-gradient(135deg,rgba(13,27,42,0.98),rgba(7,64,74,0.96))] px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.24)] md:px-8"
          >
            <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200/80">
                  Advanced Workflow
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Multi-product bundle planning comes after the single-product setup
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
                  Once products are configured and stored in the dashboard, the bundle
                  planner can import them, optimize a shared FEFCO box, and guide the
                  user through layer-based packing and placement visualization.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Import saved products",
                    icon: Boxes,
                    text: "Pull configured products directly from the dashboard.",
                  },
                  {
                    title: "Optimize combined box",
                    icon: PackagePlus,
                    text: "Create one packaging recommendation for multiple items.",
                  },
                  {
                    title: "Inspect layer breakdown",
                    icon: Activity,
                    text: "Review placement order and the 3D packing environment.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[26px] border border-white/10 bg-white/8 p-5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/75">
                        {item.text}
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
                Beginner Path
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[#0D1B2A]">
                Start with a single product workflow
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Upload two product images, validate the measurement, inspect the
                packaging recommendation, and export the output files.
              </p>
              <button
                type="button"
                onClick={() => navigate("/upload")}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0D1B2A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Start Single Product
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="rounded-[32px] border border-emerald-100 bg-white/80 p-6 shadow-[0_20px_70px_rgba(16,185,129,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
                Advanced Path
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[#0D1B2A]">
                Reuse saved work in dashboard and bundle planning
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Return to saved projects, open reports, continue packaging design,
                or combine multiple configured products into one shipping box.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={dashboardCta}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Open Dashboard
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={bundleCta}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Try Bundle Planner
                  <Boxes size={16} />
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

export default HowItWorksPage;
