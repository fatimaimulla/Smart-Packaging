import React from "react";

export default function Fefco0201Dieline(props) {
   const x = 91.5;
   const y = 214.5;
   const length = props.length || 191; // Base panel length
   const height = props.height || 245; // base panel height
   const width = props.width || 383; // top base pannel x - (base panel x + base panel length)

   const topBaseX = x + length + width; // 1069.5
   const topBaseY = y; // 214.5

   const baseEndX = x + length; // 746.5
   const baseBottomY = y + height; // 632.5
   const topBaseEndX = topBaseX + length; // 1724.5

   const bleedOffset = 5;
   const creaseOffset = 1; // For the "V" shapes in trim line
   const leaveOffset = 2; // For the horizontal "V" shapes in trim line
   const gap = 4; // Gap between panels
   const glueFlapWidth = width * 0.15;
   const glueFlapSlope = height * 0.07;
   const flapHeight = length > width ? width / 2 : length / 2; // Flap height is half of the width 323
   const flapYtop = y - flapHeight; // Y position of the top of the flap
   const flapYbottom = y + height + flapHeight; // Y position of the bottom of the flap
   const endX = topBaseEndX + width; // 1724.5 + 323 = 2047.5

   const bleedLeftOuter = x - 7.5; // 84
   const bleedLeftInner = x - 5.5; // 86
   const bleedRightInner = endX + 6; // 2053.5
   const bleedRightOuter = endX + 8; // 2055.5
   const bleedBottom = y + height + flapHeight + 10; // 804
   const bleedTop = y - flapHeight - 10; // 43
   const bleedMidY1 = y + height + 6; // 638.5
   const bleedMidY2 = y - 5; // 209.5
   const bleedMidY3 = y - 5.5; // 209
   const bleedEndY = y + 2; // 216.5

   return (
     <svg
       width="3899"
       height="2880"
       viewBox="0 0 3899 2880"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
     >
       <g id="10_REF">
         <rect
           id="Base"
           x={x}
           y={y}
           width={length}
           height={height}
           stroke="#FF0000"
           stroke-dasharray="1 1"
         />
         <rect
           id="top_base"
           x={topBaseX}
           y={topBaseY}
           width={length}
           height={height}
           stroke="#FF0000"
           stroke-dasharray="1 1"
         />

         <line
           id="base_right_top"
           x1={baseEndX}
           y1={y + creaseOffset}
           x2={topBaseX}
           y2={topBaseY + creaseOffset}
           stroke="#FF0000"
           stroke-dasharray="1 1"
         />
         <line
           id="base_right_bottom"
           x1={baseEndX}
           y1={y + height - creaseOffset}
           x2={topBaseX}
           y2={topBaseY + height - creaseOffset}
           stroke="#FF0000"
           stroke-dasharray="1 1"
         />
         <line
           id="topBase_right_top"
           x1={topBaseEndX}
           y1={topBaseY + creaseOffset}
           x2={topBaseEndX + width - creaseOffset} // 2046 = 1725 + 321
           y2={topBaseY + creaseOffset}
           stroke="#FF0000"
           stroke-dasharray="1 1"
         />
         <line
           id="topBase_right_bottom"
           x1={topBaseEndX}
           y1={topBaseY + height - creaseOffset}
           x2={topBaseEndX + width - creaseOffset} // 2046 = 1725 + 321
           y2={topBaseY + height - creaseOffset}
           stroke="#FF0000"
           stroke-dasharray="1 1"
         />

         <path
           id="Trim_line"
           d={`M ${x + leaveOffset} ${flapYtop}
        
          V${y}
          
          L ${x - glueFlapWidth} ${y + glueFlapSlope}

          V${baseBottomY - glueFlapSlope}
          
          L${x + leaveOffset} ${baseBottomY}

          
          V${flapYbottom}
          
          H${baseEndX - gap}
          V${baseBottomY}


          
          

          H${baseEndX + gap}
          V${flapYbottom}
          H${topBaseX - gap}
          V${baseBottomY}
          
          H${topBaseX + gap}
          V${flapYbottom}
          H${topBaseEndX - gap}
          V${baseBottomY}
          H${topBaseEndX + gap}
          V${flapYbottom}
          
          H${endX - gap}
          
          V${baseBottomY - creaseOffset}
          H${endX}

          V${y}
          
          H${endX - gap}
          
          V${flapYtop}
          
            
          H${topBaseEndX + gap}

          V${y}
          
          
          H${topBaseEndX - gap}
          
          V${flapYtop}
          
          H${topBaseX + gap}
          
          V${y}
          
          H${topBaseX - gap}
          
          
          V${flapYtop}
          H${baseEndX + gap}
          
          V${y}
        
          H${baseEndX - gap}
          V${flapYtop}
          H${x + leaveOffset}
          
          Z`}
           stroke="#343CB7"
         />

         <path
           id="bleed_line"
           d={`M${bleedLeftOuter} ${baseBottomY}
              V${bleedMidY1}
              H${bleedLeftInner}
              V${bleedBottom}
              H${bleedRightInner}
              V${bleedMidY1}
              H${bleedRightOuter}
              V${bleedMidY2}
              H${bleedRightInner}
              V${bleedTop}
              H${bleedLeftInner}
              V${bleedMidY3}
              H${bleedLeftOuter}
              V${bleedEndY}`}
           stroke="#A2D68E"
         />
       </g>
     </svg>
   );
}

Fefco0201Dieline.defaultDimensions = {
  l: 191,
  w: 383,
  h: 245,
};
