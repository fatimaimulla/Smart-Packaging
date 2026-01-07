import React from "react";

export default function Fefco0201Dieline(props) {
  // Parameters from your design
  const x = props.x || 100;
  const y = props.y || 200;
  const length = props.length || 191;
  const width = props.width || 383;
  const height = props.height || 245;
  
  // Fixed values from your SVG
  const glueFlapWidth = 40; // Based on 70.5 to 110.5
  const topFlapY = y-(length/2);
  const bottomFlapY = y+height+(length/2);
  const bleedOffset = 5;
  const creaseOffset = 1; // For the "V" shapes in trim line
  
  // Calculate key positions
  const panel1X = x + glueFlapWidth;
  const panel2X = panel1X + width;
  const panel3X = panel2X + length;
  const panel4X = panel3X + width;
  const panel5X = panel4X + length;
  
  // Create a more accurate trim line based on your pattern
  const createTrimLine = () => {
    const parts = [];
    
    // Start at top-left of glue flap
    parts.push(`M${x} ${y}`);
    
    // Down to top flap line
    parts.push(`V${topFlapY}`);
    
    // Panel 1 (Left side panel) top tab
    parts.push(`H${panel2X - 2.5}`);
    parts.push(`V${y - creaseOffset}`);
    parts.push(`L${panel2X} ${y}`);
    parts.push(`L${panel2X + 2.5} ${y - creaseOffset}`);
    parts.push(`V${topFlapY}`);
    
    // Panel 2 (Front panel) top tab
    parts.push(`H${panel3X - 2.5}`);
    parts.push(`V${y - creaseOffset}`);
    parts.push(`L${panel3X} ${y}`);
    parts.push(`L${panel3X + 2.5} ${y - creaseOffset}`);
    parts.push(`V${topFlapY}`);
    
    // Panel 3 (Back panel) top tab
    parts.push(`H${panel4X - 2.5}`);
    parts.push(`V${y - creaseOffset}`);
    parts.push(`L${panel4X} ${y}`);
    parts.push(`L${panel4X + 2.5} ${y - creaseOffset}`);
    parts.push(`V${topFlapY}`);
    
    // Panel 4 (Right side panel) top tab
    parts.push(`H${panel5X - glueFlapWidth - 2.5}`);
    parts.push(`V${y - creaseOffset}`);
    parts.push(`L${panel5X - glueFlapWidth} ${y}`);
    parts.push(`L${panel5X - glueFlapWidth + 1} ${y + 1}`);
    
    // Down right side
    parts.push(`V${y + height - 1}`);
    parts.push(`L${panel5X - glueFlapWidth} ${y + height}`);
    
    // Bottom flap right side
    parts.push(`V${bottomFlapY}`);
    
    // Back across bottom flaps (right to left)
    parts.push(`H${panel4X + 2.5}`);
    parts.push(`V${y + height + creaseOffset}`);
    parts.push(`L${panel4X} ${y + height}`);
    parts.push(`L${panel4X - 2.5} ${y + height + creaseOffset}`);
    parts.push(`V${bottomFlapY}`);
    
    parts.push(`H${panel3X + 2.5}`);
    parts.push(`V${y + height + creaseOffset}`);
    parts.push(`L${panel3X} ${y + height}`);
    parts.push(`L${panel3X - 2.5} ${y + height + creaseOffset}`);
    parts.push(`V${bottomFlapY}`);
    
    parts.push(`H${panel2X + 2.5}`);
    parts.push(`V${y + height + creaseOffset}`);
    parts.push(`L${panel2X} ${y + height}`);
    parts.push(`L${panel2X - 2.5} ${y + height + creaseOffset}`);
    parts.push(`L${panel2X - 2.5} ${bottomFlapY}`);
    
    parts.push(`H${x}`);
    parts.push(`V${y + height - creaseOffset}`);
    
    // Glue flap bottom diagonal
    parts.push(`L${x-glueFlapWidth} ${y+height-12}`);
    
    // Glue flap left side
    parts.push(`V${y+12}`);
    
    // Glue flap top diagonal
    parts.push(`L${x} ${y}`);
    
    return parts.join("");
  };
  
  // Create bleed line
  const createBleedLine = () => {
    return `
      M${x - bleedOffset-3} ${y }
      V${y - bleedOffset}
      H${x-bleedOffset }
      V${topFlapY-bleedOffset}
      H${panel5X - glueFlapWidth +3}
      V${y - bleedOffset}
      H${panel5X - glueFlapWidth + bleedOffset+3}
      V${y + height +3}
      H${panel5X - glueFlapWidth + bleedOffset}
      V${bottomFlapY+bleedOffset}
      H${x - bleedOffset}
      V${y + height +bleedOffset}
      H${x - bleedOffset-3}
      V${y + height }
    `;
  };

  return (
    <svg 
      width="3413" 
      height="2431" 
      viewBox="0 0 3413 2431" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bleed Line */}
      <path 
        id="bleed_line" 
        d={createBleedLine()} 
        stroke="#A2D68E"
      />
      
      {/* Base Panel Rectangle */}
      <rect 
        id="base_pannel" 
        x={x} 
        y={y} 
        width={panel5X - glueFlapWidth - x+1} 
        height={height} 
        stroke="#FC0707" 
        strokeDasharray="1 1"
      />
      
      {/* Crease Lines - vertical */}
      <line 
        id="first_line" 
        x1={panel2X} 
        y1={y - 0.5} 
        x2={panel2X} 
        y2={y + height - 0.5} 
        stroke="#FC0707" 
        strokeDasharray="1 1"
      />
      <line 
        id="second_line" 
        x1={panel3X} 
        y1={y - 0.5} 
        x2={panel3X} 
        y2={y + height - 0.5} 
        stroke="#FC0707" 
        strokeDasharray="1 1"
      />
      <line 
        id="third_line" 
        x1={panel4X} 
        y1={y - 0.5} 
        x2={panel4X} 
        y2={y + height - 0.5} 
        stroke="#FC0707" 
        strokeDasharray="1 1"
      />
      
      {/* Trim Line */}
      <path 
        id="trim_line" 
        d={createTrimLine()}
        stroke="#343CB7" 
      />
    </svg>
  );
}