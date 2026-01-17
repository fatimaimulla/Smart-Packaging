export default function Fefco0301Dieline(props) {
  const x = props.x || 140;
  const y = props.y || 120;
  const length = props.length || 300;
  const width = props.width || 200;
  const height = props.height || 60;

  const creaseInset = 1;
  const flapGap = 2;
  const boxGap = 20;
  const bleed = 5;

  /* ======================================================
     BOTTOM BOX (LEFT)
  ====================================================== */

  const temp = length * 0.25;
  const sideflap_height = temp <= height ? temp : height + 0.5;
  const Y = y + creaseInset;

  const trimPath = `
    M ${x} ${Y}
    V ${Y - height}
    H ${x + length}
    V ${Y}
    H ${x + length + flapGap}
    V ${Y - sideflap_height}
    H ${x + length + flapGap + height}
    V ${y + width + sideflap_height - creaseInset}
    H ${x + length + flapGap}
    V ${y + width - creaseInset}
    H ${x + length}
    V ${y + width + height - creaseInset}
    H ${x}
    V ${y + width - creaseInset}
    H ${x - flapGap}
    V ${y + width + sideflap_height - creaseInset}
    H ${x - flapGap - height}
    V ${y - sideflap_height + creaseInset}
    H ${x - flapGap}
    V ${Y}
    H ${x}
    Z
  `;

  const bleedPath = `
    M ${x - bleed} ${Y - height - bleed}
    H ${x + length + bleed}
    V ${Y - sideflap_height - bleed}
    H ${x + length + flapGap + height + bleed}
    V ${y + width + sideflap_height - creaseInset + bleed}
    H ${x + length + bleed}
    V ${y + width + height - creaseInset + bleed}
    H ${x - bleed}
    V ${y + width + sideflap_height - creaseInset + bleed}
    H ${x - flapGap - height - bleed}
    V ${Y - sideflap_height - bleed}
    H ${x - bleed}
    Z
  `;

  /* ======================================================
     TOP BOX (RIGHT)
  ====================================================== */

  const x2 = x + length + height + flapGap + boxGap + height;
  const y2 = y;

  const length2 = length + 1.5;
  const width2 = width + 1.5;
  const height2 = height + 1.5;

  const temp2 = length2 * 0.25;
  const sideflap_height2 = temp2 <= height2 ? temp2 : height2 + 0.5;
  const Y2 = y2 + creaseInset;

  const trimPath2 = `
    M ${x2} ${Y2}
    V ${Y2 - height2}
    H ${x2 + length2}
    V ${Y2}
    H ${x2 + length2 + flapGap}
    V ${Y2 - sideflap_height2}
    H ${x2 + length2 + flapGap + height2}
    V ${y2 + width2 + sideflap_height2 - creaseInset}
    H ${x2 + length2 + flapGap}
    V ${y2 + width2 - creaseInset}
    H ${x2 + length2}
    V ${y2 + width2 + height2 - creaseInset}
    H ${x2}
    V ${y2 + width2 - creaseInset}
    H ${x2 - flapGap}
    V ${y2 + width2 + sideflap_height2 - creaseInset}
    H ${x2 - flapGap - height2}
    V ${y2 - sideflap_height2 + creaseInset}
    H ${x2 - flapGap}
    V ${Y2}
    H ${x2}
    Z
  `;

  const bleedPath2 = `
    M ${x2 - bleed} ${Y2 - height2 - bleed}
    H ${x2 + length2 + bleed}
    V ${Y2 - sideflap_height2 - bleed}
    H ${x2 + length2 + flapGap + height2 + bleed}
    V ${y2 + width2 + sideflap_height2 - creaseInset + bleed}
    H ${x2 + length2 + bleed}
    V ${y2 + width2 + height2 - creaseInset + bleed}
    H ${x2 - bleed}
    V ${y2 + width2 + sideflap_height2 - creaseInset + bleed}
    H ${x2 - flapGap - height2 - bleed}
    V ${Y2 - sideflap_height2 - bleed}
    H ${x2 - bleed}
    Z
  `;

  const margin = height2 + flapGap + boxGap + bleed + 40;

  return (
    <svg
      width="800"
      height="500"
      viewBox={`${x - margin} ${y - margin} ${length + length2 + 4 * margin} ${width + 2 * margin}`}
    >

      {/* ===== BLEED ===== */}
      <path d={bleedPath} fill="none" stroke="#A2D68E" />
      <path d={bleedPath2} fill="none" stroke="#A2D68E" />

      {/* ===== BASE PANELS ===== */}
      <rect x={x} y={y} width={length} height={width}
        stroke="#FC0707" strokeDasharray="1 1" fill="none" />
      <rect x={x2} y={y2} width={length2} height={width2}
        stroke="#FC0707" strokeDasharray="1 1" fill="none" />

      {/* ===== CREASES (BOTTOM BOX) ===== */}
      <line x1={x - height} y1={y + creaseInset} x2={x} y2={y + creaseInset}
        stroke="#FC0707" strokeDasharray="1 1" />
      <line x1={x - height} y1={y + width - creaseInset} x2={x} y2={y + width - creaseInset}
        stroke="#FC0707" strokeDasharray="1 1" />
      <line x1={x + length} y1={y + creaseInset} x2={x + length + height} y2={y + creaseInset}
        stroke="#FC0707" strokeDasharray="1 1" />
      <line x1={x + length} y1={y + width - creaseInset} x2={x + length + height} y2={y + width - creaseInset}
        stroke="#FC0707" strokeDasharray="1 1" />

      {/* ===== CREASES (TOP BOX) ===== */}
      <line x1={x2 - height2} y1={y2 + creaseInset} x2={x2} y2={y2 + creaseInset}
        stroke="#FC0707" strokeDasharray="1 1" />
      <line x1={x2 - height2} y1={y2 + width2 - creaseInset} x2={x2} y2={y2 + width2 - creaseInset}
        stroke="#FC0707" strokeDasharray="1 1" />
      <line x1={x2 + length2} y1={y2 + creaseInset} x2={x2 + length2 + height2} y2={y2 + creaseInset}
        stroke="#FC0707" strokeDasharray="1 1" />
      <line x1={x2 + length2} y1={y2 + width2 - creaseInset} x2={x2 + length2 + height2} y2={y2 + width2 - creaseInset}
        stroke="#FC0707" strokeDasharray="1 1" />

      {/* ===== TRIM ===== */}
      <path d={trimPath} fill="none" stroke="#343CB7" />
      <path d={trimPath2} fill="none" stroke="#343CB7" />

    </svg>
  );
}

Fefco0301Dieline.defaultDimensions = {
  l: 55,
  w: 55,
  h: 33,
};