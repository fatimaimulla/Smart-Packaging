import React from "react";

export default function Fefco0203Dieline(props) {
  // Parameters
  const x = 150;
  const y = 300;
  const length = props.length || 150;    // Front/Back panel length
  const width = props.width || 180;      // Side panel width
  const height = props.height || 210;    // Box height
  
  // Calculate flap heights (DIFFERENT from 0201!)
  const frontBackFlapHeight = length / 2;     // Flaps on front/back panels: half of width
  const sideFlapHeight = width / 2;         // Flaps on side panels: half of length
  

  const glueFlapWidth = 35.5;  
  const glueFlapTopY = y+12;
  const glueFlapBottomY = y+height-12;
  
  // Offsets
  const bleedOffset = 4;       
  const creaseOffset = 1;      
  const creaseOffsetX = 2.5;   
  
  // Calculate key positions
  const leftGlueX = x - glueFlapWidth;  // 29
  const leftSideX = x;                  // 64.5
  // changes done :
  const frontX = leftSideX + length;     // 64.5 + 141 = 205.5 -----------
  const rightSideX = frontX + width;   // 205.5 + 195 = 400.5
  const backX = rightSideX + length;     // 400.5 + 141 = 541.5
  const endX = backX + width;          // 541.5 + 195 = 736.5
  
  // Calculate flap Y positions
  const leftSideTopFlapY = y - sideFlapHeight;           // Top of left side flap
  const frontTopFlapY = y - frontBackFlapHeight;         // Top of front flap
  const rightSideTopFlapY = y - sideFlapHeight;          // Top of right side flap
  const backTopFlapY = y - frontBackFlapHeight;          // Top of back flap
  
  const leftSideBottomFlapY = y + height + sideFlapHeight ;       // Bottom of left side flap
  const frontBottomFlapY = y + height + frontBackFlapHeight;     // Bottom of front flap
  const rightSideBottomFlapY = y + height + sideFlapHeight;      // Bottom of right side flap
  const backBottomFlapY = y + height + frontBackFlapHeight;      // Bottom of back flap
  
  // Dynamic trim line function
  const createTrimLine = () => {
    const parts = [];
    
    // Start at top-left of glue flap
    parts.push(`M${leftGlueX} ${glueFlapTopY}`);
    
    // Down to top-left of left side panel (diagonal)
    parts.push(`L${x} ${y}`);
    
    // Down to top flap of left side panel
    parts.push(`V${leftSideTopFlapY}`);//----
    
    // Across top of left side flap
    parts.push(`H${frontX - creaseOffsetX}`);
    
    // V-notch transition to front panel flap
    parts.push(`V${y - creaseOffset}`);
    parts.push(`L${frontX} ${y}`);//--- v part done 
    parts.push(`L${frontX + creaseOffsetX} ${y - creaseOffset}`);
    parts.push(`V${frontTopFlapY}`);// done upar tak jaara hai length/2
    
    // Across top of front flap
    parts.push(`H${rightSideX - creaseOffsetX}`); // width flap ke across leke gaye 
    
    // V-notch transition to right side panel flap
    parts.push(`V${y - creaseOffset}`);
    parts.push(`L${rightSideX} ${y}`);
    parts.push(`L${rightSideX + creaseOffsetX} ${y - creaseOffset}`);// done v shape of width flap
    parts.push(`V${rightSideTopFlapY}`);//....
    
    // Across top of right side flap
    parts.push(`H${backX - creaseOffsetX}`); // second length flap ko accross leke gaye
    
    // V-notch transition to back panel flap
    parts.push(`V${y - creaseOffset}`);
    parts.push(`L${backX} ${y}`);
    parts.push(`L${backX + creaseOffsetX} ${y - creaseOffset}`);// done v of second length flap
    parts.push(`V${backTopFlapY}`);
    
    // Across top of back flap to right edge
    parts.push(`H${endX - creaseOffsetX}`);
    parts.push(`V${y - creaseOffset}`);
    parts.push(`L${endX } ${y}`); // half v ho gaya
    parts.push(`L${endX  } ${y + 1}`);// accross end x leke gaye 
    
    // Down right side of back panel
    parts.push(`V${y + height - 1}`);
    parts.push(`L${endX -creaseOffsetX} ${y +height+creaseOffset}`);// done this 
    
    // Down to bottom flap of back panel
    parts.push(`V${backBottomFlapY}`); // bottom right wale ko length/2 tak leke gaye
    
    // Across bottom flaps from right to left
    parts.push(`H${backX + creaseOffsetX}`);
    parts.push(`V${y + height + creaseOffset}`);
    parts.push(`L${backX} ${y + height}`);
    parts.push(`L${backX - creaseOffsetX} ${y + height + creaseOffset}`);// v formation between bottom right pannels 
    parts.push(`V${rightSideBottomFlapY}`);
    
    // Bottom of right side flap
    parts.push(`H${rightSideX + creaseOffsetX}`);
    parts.push(`V${y + height + creaseOffset}`);
    parts.push(`L${rightSideX} ${y + height}`);
    parts.push(`L${rightSideX - creaseOffsetX} ${y + height + creaseOffset}`);
    parts.push(`V${backBottomFlapY}`);
    
    // Bottom of front flap
    parts.push(`H${frontX + creaseOffsetX}`);
    parts.push(`V${y + height + creaseOffset}`);
    parts.push(`L${frontX} ${y + height}`);
    parts.push(`L${frontX - creaseOffsetX} ${y + height + creaseOffset}`);
    parts.push(`V${rightSideBottomFlapY}`);
    
    // Bottom of left side flap
    parts.push(`H${x + creaseOffsetX}`);
    parts.push(`V${y + height + creaseOffset}`);
    parts.push(`L${x} ${y + height}`);

    
    // Up to bottom of main panel
    parts.push(`H${x}`);
    parts.push(`V${y + height - creaseOffset}`);
    
    // Glue flap bottom diagonal
    parts.push(`L${leftGlueX} ${glueFlapBottomY}`);
    
    // Glue flap left side up
    parts.push(`V${glueFlapTopY}`);
    
    // Close path
    parts.push(`Z`);
    
    return parts.join("");
  };
  
  // Dynamic bleed line function
  const createBleedLine = () => {
    const bleedAdj = 1.25; // Small adjustment from original
    
    return `
      M${x - bleedOffset - bleedAdj} ${y}
      V${y - bleedOffset}
      H${x - bleedOffset}
      V${leftSideTopFlapY - bleedOffset}
      H${frontX    }
      V${y - frontBackFlapHeight - bleedOffset}
      H${ rightSideX  }
      V${y - sideFlapHeight - bleedOffset}
      H${backX }

      V${y-frontBackFlapHeight-bleedOffset}
      H${endX + bleedAdj+2}
      V${y - bleedOffset}
      
      H${endX + bleedOffset+bleedAdj}
      V${y + height + bleedAdj+2}
      H${endX  + bleedOffset-2}
      V${backBottomFlapY + bleedOffset}
      H${backX }
      V${rightSideBottomFlapY + bleedOffset}
      H${rightSideX }
      

      V${backBottomFlapY + bleedOffset}
    H${frontX }
V${rightSideBottomFlapY + bleedOffset}
      H${x - bleedAdj}
      V${y + height + bleedOffset}
      H${x - bleedOffset - bleedAdj}
      V${y + height}
    `;
  };

  return (
    <svg 
          id="fefco-0203-dieline"

      width="1017" 
      height="736" 
      viewBox="0 0 1017 736" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bleed Line */}
      <path 
        id="bleed_line" 
        d={createBleedLine()} 
        stroke="#4CBA33"
      />
      
      {/* Base Panel Rectangle */}
      <rect 
        id="crease_base" 
        x={x} 
        y={y} 
        width={(length * 2 + width * 2)} 
        height={height} 
        stroke="#FF0000" 
        strokeDasharray="1 1"
      />
      
      {/* Crease Lines */}
      <line 
        id="line_first" 
        x1={x + length} 
        y1={y} 
        x2={x + length} 
        y2={y + height} 
        stroke="#FF0000" 
        strokeDasharray="1 1"
      />
      <line 
        id="line_second" 
        x1={x + length + width} 
        y1={y} 
        x2={x + length + width} 
        y2={y + height} 
        stroke="#FF0000" 
        strokeDasharray="1 1"
      />
      <line 
        id="line_third" 
        x1={x + (length * 2) + width} 
        y1={y} 
        x2={x + (length * 2) + width} 
        y2={y + height} 
        stroke="#FF0000" 
        strokeDasharray="1 1"
      />
      
      {/* Trim Line */}
      <path 
        id="trim_line" 
        d={createTrimLine()}
        stroke="#4E33BA" 
      />
      
     
     
    </svg>
  );
}

Fefco0203Dieline.defaultDimensions = {
  l: 200,
  w: 300,
  h: 150,
};