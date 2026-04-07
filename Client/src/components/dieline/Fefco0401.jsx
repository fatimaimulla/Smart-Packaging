export default function Fefco0401Dieline(props) {
  //Parameters
  const x = props.x || 541.5;
  const y = props.y || 469.5;
  const length = props.length || 400; // horizontal
  const width = props.width || 250; // vertical
  const height = props.height || 150; // straight up

  //Base Panel Position
  const baseX = x;
  const baseY = y;

  //Crease Line Dimension
  const topCreaseY = baseY - height;
  const bottomCreaseY = baseY + width + height;
  const leftCreaseX = baseX - height;
  const rightCreaseX = baseX + length + height;

  //Flap Dimension
  const verticalFlap = height + width / 2;
  const horizontalFlap = height + 0.4 * length;

  //Trim Boundaries
  const trimTop = baseY - verticalFlap;
  const trimBottom = baseY + width + verticalFlap;
  const trimLeft = baseX - horizontalFlap;
  const trimRight = baseX + length + horizontalFlap;

  //Bleed Offset
  const bleedOffset = 5;
  const svgPadding = 24;
  const minX = trimLeft - bleedOffset - svgPadding;
  const minY = trimTop - bleedOffset - svgPadding;
  const maxX = trimRight + bleedOffset + svgPadding;
  const maxY = trimBottom + bleedOffset + svgPadding;
  const svgWidth = maxX - minX;
  const svgHeight = maxY - minY;

  //Trim Path
  const createTrimLine = () => {
    const p = [];

    // Start at top-left of top flap
    p.push(`M${baseX} ${trimTop}`);

    // Top flap
    p.push(`H${baseX + length}`);

    // Right side
    p.push(`V${baseY}`);
    p.push(`H${trimRight}`);
    p.push(`V${baseY + width}`);

    // Bottom flap
    p.push(`H${baseX + length}`);
    p.push(`V${trimBottom}`);
    p.push(`H${baseX}`);

    // Left side
    p.push(`V${baseY + width}`);
    p.push(`H${trimLeft}`);
    p.push(`V${baseY}`);

    // Close
    p.push(`H${baseX}`);
    p.push("Z");

    return p.join("");
  };

  //Bleed Path
  const createBleedLine = () => {
    const p = [];

    p.push(`M${baseX - bleedOffset} ${trimTop - bleedOffset}`);
    p.push(`H${baseX + length + bleedOffset}`);
    p.push(`V${baseY - bleedOffset}`);
    p.push(`H${trimRight + bleedOffset}`);
    p.push(`V${baseY + width + bleedOffset}`);
    p.push(`H${baseX + length + bleedOffset}`);
    p.push(`V${trimBottom + bleedOffset}`);
    p.push(`H${baseX - bleedOffset}`);
    p.push(`V${baseY + width + bleedOffset}`);
    p.push(`H${trimLeft - bleedOffset}`);
    p.push(`V${baseY - bleedOffset}`);
    p.push(`H${baseX - bleedOffset}`);
    p.push("Z");

    return p.join("");
  };

  return (
    <div>
      <svg
        id="fefco-0401-dieline"
        width={svgWidth}
        height={svgHeight}
        viewBox={`${minX} ${minY} ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base Panel */}
        <rect
          id="Base_crease_panel"
          x={baseX}
          y={baseY}
          width={length}
          height={width}
          stroke="#FF0000"
          stroke-dasharray="1 1"
        />

        {/* Top crease */}
        <line
          id="top_crease_line"
          x1={baseX}
          y1={topCreaseY}
          x2={baseX + length}
          y2={topCreaseY}
          stroke="#FC0707"
          strokeDasharray="1 1"
        />

        {/* Bottom crease */}
        <line
          id="bottom_crease_line"
          x1={baseX}
          y1={bottomCreaseY}
          x2={baseX + length}
          y2={bottomCreaseY}
          stroke="#FC0707"
          strokeDasharray="1 1"
        />

        {/* Left crease */}
        <line
          id="left_crease_line"
          x1={leftCreaseX}
          y1={baseY}
          x2={leftCreaseX}
          y2={baseY + width}
          stroke="#FC0707"
          strokeDasharray="1 1"
        />

        {/* Right crease */}
        <line
          id="right_crease_line"
          x1={rightCreaseX}
          y1={baseY}
          x2={rightCreaseX}
          y2={baseY + width}
          stroke="#FC0707"
          strokeDasharray="1 1"
        />

        {/* Trim Line */}
        <path
          id="trim_line"
          d={createTrimLine()}
          stroke="#343CB7"
          fill="none"
        />

        {/* Bleed Line */}
        <path
          id="bleed_line"
          d={createBleedLine()}
          stroke="#A2D68E"
          fill="none"
        />
      </svg>
    </div>
  );
}

Fefco0401Dieline.defaultDimensions = {
  l: 400,
  w: 250,
  h: 150,
};
