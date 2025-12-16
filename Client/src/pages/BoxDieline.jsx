import React from "react";

export default function BoxDieline({
  panelW = 100, // front / back width
  panelH = 200, // front / back height
  depth = 50, // side panel width
  glueW = 58, // glue-flap width
  tabDepth = 98, // vertical depth of lock-tab
  stroke = "black",
}) {
  /* ------------- derived metrics ------------- */
  const g = glueW;
  const w = panelW;
  const h = panelH;
  const d = depth;
  const t = tabDepth; // lock-tab vertical projection
  const r = 9; // corner radius (kept from original)
  const cx = 40; // left page margin
  const cy = 40; // top page margin

  /* ------------- horizontal anchors ------------- */
  const leftGlue = cx;
  const leftBack = cx + g;
  const leftSide = cx + g + w;
  const leftFront = cx + g + w + d;
  const rightFront = cx + g + w + d + w;

  /* ------------- helper: top lock-tab (original angles) ------------- */
  const topLock = `
    M${leftFront}  ${cy}
    H${rightFront}
    L${rightFront - 18} ${cy - t}
    Q${leftFront + w / 2} ${cy - t - 6}, ${leftFront + 18} ${cy - t}
    L${leftFront} ${cy}`;

  /* ------------- helper: bottom lock-tab (mirrored) ------------- */
  const bottomLock = `
    M${leftFront}  ${cy + h}
    H${rightFront}
    L${rightFront - 18} ${cy + h + t}
    Q${leftFront + w / 2} ${cy + h + t + 6}, ${leftFront + 18} ${cy + h + t}
    L${leftFront} ${cy + h}`;

  /* ------------- glue-flap ears (original curves) ------------- */
  const glueEarTop = `
    M${leftGlue + g} ${cy}
    V${cy - 14}
    Q${leftGlue + g + 8} ${cy - 20}, ${leftGlue + g + 16} ${cy - 14}
    V${cy}`;

  const glueEarBottom = `
    M${leftGlue + g} ${cy + h}
    V${cy + h + 14}
    Q${leftGlue + g + 8} ${cy + h + 20}, ${leftGlue + g + 16} ${cy + h + 14}
    V${cy + h}`;

  /* ------------- fold-line notches (exact sizes) ------------- */
  const notch = (x, y) => `M${x} ${y} h39 v4 h-39 z`;

  return (
    <svg
      width={rightFront + 40}
      height={cy + h + 60}
      viewBox={`0 0 ${rightFront + 40} ${cy + h + 60}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ---------- panels ---------- */}
      <rect x={leftGlue} y={cy} width={g} height={h} stroke={stroke} />
      <rect x={leftBack} y={cy} width={w} height={h} stroke={stroke} />
      <rect x={leftSide} y={cy} width={d} height={h} stroke={stroke} />
      <rect x={leftFront} y={cy} width={w} height={h} stroke={stroke} />

      {/* ---------- lock-tabs ---------- */}
      <path d={topLock} stroke={stroke} />
      <path d={bottomLock} stroke={stroke} />

      {/* ---------- glue-flap ears ---------- */}
      <path d={glueEarTop} stroke={stroke} />
      <path d={glueEarBottom} stroke={stroke} />

      {/* ---------- fold notches ---------- */}
      <path d={notch(leftBack + 41, cy - 4)} stroke={stroke} />
      <path d={notch(leftBack + 41, cy + h)} stroke={stroke} />
      <path d={notch(leftBack + 121, cy - 4)} stroke={stroke} />
      <path d={notch(leftBack + 121, cy + h)} stroke={stroke} />
    </svg>
  );
}
