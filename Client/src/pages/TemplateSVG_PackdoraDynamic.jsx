// TemplateSVG_PackdoraDynamic.jsx
import React from "react";

export function TemplateSVG_PackdoraDynamic({
  length = 200,
  width = 186,
  height = 160,
  thickness = 1.5,
  startX = 30,
  startY = 25,
  strokeScale = 1,
  ...props
}) {
  const x0 = startX;
  const x1 = x0 + length;
  const x2 = x1 + width;
  const x3 = x2 + length;
  const x4 = x3 + width;

  const topFlapVisual = 25;

  const scaledBodyHeight = Math.round(
    height * 1.05 + 0.000032 * height ** 2 + thickness * 15
  );

  const bodyTopY = startY;
  const bodyBottomY = bodyTopY + scaledBodyHeight;

  const bottomFlapH = Math.round(width / 2);
  const tuckDepth = Math.round(width * 0.34);

  const arcR = Math.max(6, Math.round(Math.min(width, length) * 0.03));

  const strokeKnife = Math.max(0.8, strokeScale * 0.85);
  const strokeFold = Math.max(0.6, strokeScale * 0.6);
  const strokeOuter = Math.max(1, strokeScale * 1.2);

  const arc = (rx, ry, laf, sf, x, y) =>
    `A${rx},${ry} 0 ${laf},${sf} ${x},${y}`;

  const outerTop = Math.min(x0 - 5, 20);
  const outerLeft = outerTop;
  const outerRight = x4 + 5;
  const outerBottom = bodyBottomY + bottomFlapH + 40;

  const outerPath = [
    `M${outerLeft + arcR},${outerBottom}`,
    `L${outerRight - arcR},${outerBottom}`,
    arc(arcR, arcR, 0, 0, outerRight, outerBottom - arcR),
    `L${outerRight},${bodyBottomY + 5}`,
    `L${outerRight + 2},${bodyBottomY + 5}`,
    `L${outerRight + 2},${bodyTopY + 200}`,
    `L${outerRight - 3},${bodyTopY + 197}`,
    `L${outerRight - 3},${topFlapVisual - 114}`,
    `L${x3 + length * 0.33},${topFlapVisual - 114}`,
    `Q${x3 - 20},${topFlapVisual - 114} ${x3 - 80},${topFlapVisual - 50}`,
    `Q${x2 + 30},${topFlapVisual + 10} ${x2},${topFlapVisual}`,
    `L${x1},${topFlapVisual}`,
    `L${outerLeft + 40},${topFlapVisual}`,
    arc(arcR, arcR, 0, 0, outerLeft, topFlapVisual + arcR),
    `L${outerLeft},${bodyTopY + 10}`,
    `L${outerLeft + 30},${bodyTopY + 20}`,
    `L${outerLeft + 30},${bodyBottomY - 20}`,
    `L${outerLeft + arcR},${outerBottom}`,
    "Z",
  ].join(" ");

  const rectPath = (left, top, w, h, r) => {
    const right = left + w;
    const bottom = top + h;
    return [
      `M${left + r},${top}`,
      `L${right - r},${top}`,
      arc(r, r, 0, 0, right, top + r),
      `L${right},${bottom - r}`,
      arc(r, r, 0, 0, right - r, bottom),
      `L${left + r},${bottom}`,
      arc(r, r, 0, 0, left, bottom - r),
      `L${left},${top + r}`,
      arc(r, r, 0, 0, left + r, top),
      "Z",
    ].join(" ");
  };

  const panel_bottom = {
    left: x0,
    top: bodyTopY,
    w: length,
    h: scaledBodyHeight,
  };
  const panel_front = {
    left: x1,
    top: bodyTopY,
    w: width,
    h: scaledBodyHeight,
  };
  const panel_mid = { left: x2, top: bodyTopY, w: length, h: scaledBodyHeight };
  const panel_back = { left: x3, top: bodyTopY, w: width, h: scaledBodyHeight };

  const bottom_flap_left = {
    left: x0,
    top: bodyBottomY,
    w: length - 2,
    h: bottomFlapH,
  };
  const bottom_flap_top = {
    left: x1 + 1,
    top: bodyBottomY,
    w: width - 2,
    h: bottomFlapH,
  };
  const bottom_flap_right = {
    left: x2 + 1,
    top: bodyBottomY,
    w: length - 2,
    h: bottomFlapH,
  };
  const bottom_flap_bottom = {
    left: x3 + 1,
    top: bodyBottomY,
    w: width - 2,
    h: bottomFlapH,
  };

  const folds = [
    { x1: x0, y1: bodyTopY, x2: x4, y2: bodyTopY },
    { x1: x1, y1: bodyTopY, x2: x1, y2: bodyBottomY },
    { x1: x2, y1: bodyTopY, x2: x2, y2: bodyBottomY },
    { x1: x3, y1: bodyTopY, x2: x3, y2: bodyBottomY },
    { x1: x0, y1: bodyBottomY, x2: x4, y2: bodyBottomY },
  ];

  const dashArr = `${(1.2 * strokeScale).toFixed(3)} ${(
    0.8 * strokeScale
  ).toFixed(3)}`;

  return (
    <svg
      width={Math.max(1000, x4 + 140)}
      height={outerBottom + 40}
      viewBox={`0 0 ${Math.max(1000, x4 + 140)} ${outerBottom + 40}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d={outerPath}
        stroke="#46ba00"
        strokeWidth={strokeOuter}
        fill="#fff"
      />

      <g fill="#ffffff" stroke="#000" strokeWidth={strokeKnife}>
        <path
          d={rectPath(
            panel_bottom.left,
            panel_bottom.top,
            panel_bottom.w,
            panel_bottom.h,
            2
          )}
        />
        <path
          d={rectPath(
            panel_front.left,
            panel_front.top,
            panel_front.w,
            panel_front.h,
            2
          )}
        />
        <path
          d={rectPath(
            panel_mid.left,
            panel_mid.top,
            panel_mid.w,
            panel_mid.h,
            2
          )}
        />
        <path
          d={rectPath(
            panel_back.left,
            panel_back.top,
            panel_back.w,
            panel_back.h,
            2
          )}
        />
      </g>

      <rect
        x={bottom_flap_left.left}
        y={bottom_flap_left.top}
        width={bottom_flap_left.w}
        height={bottom_flap_left.h}
        stroke="#000"
        fill="none"
      />
      <rect
        x={bottom_flap_top.left}
        y={bottom_flap_top.top}
        width={bottom_flap_top.w}
        height={bottom_flap_top.h}
        stroke="#000"
        fill="none"
      />
      <rect
        x={bottom_flap_right.left}
        y={bottom_flap_right.top}
        width={bottom_flap_right.w}
        height={bottom_flap_right.h}
        stroke="#000"
        fill="none"
      />
      <rect
        x={bottom_flap_bottom.left}
        y={bottom_flap_bottom.top}
        width={bottom_flap_bottom.w}
        height={bottom_flap_bottom.h}
        stroke="#000"
        fill="none"
      />

      <g
        stroke="#fa0000"
        strokeWidth={strokeFold}
        strokeDasharray={dashArr}
        fill="none"
      >
        {folds.map((f, i) => (
          <line key={i} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} />
        ))}
      </g>

      <g fontSize={11} fill="#333">
        <text x={panel_bottom.left + 6} y={panel_bottom.top + 14}>
          panel_bottom (L)
        </text>
        <text x={panel_front.left + 6} y={panel_front.top + 14}>
          panel_front (W)
        </text>
        <text x={panel_mid.left + 6} y={panel_mid.top + 14}>
          panel_mid (L)
        </text>
        <text x={panel_back.left + 6} y={panel_back.top + 14}>
          panel_back (W)
        </text>
      </g>
    </svg>
  );
}

export default TemplateSVG_PackdoraDynamic;
