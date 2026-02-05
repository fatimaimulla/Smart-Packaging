export function generateFefco0203DXF(props) {
  // Parameters
  const x = 150;
  const y = 300;
  const length = props.length || 150;    // Front/Back panel length
  const width = props.width || 180;      // Side panel width
  const height = props.height || 210;    // Box height
  
  // Calculate flap heights (DIFFERENT from 0201!)
  const frontBackFlapHeight = length / 2;     // Flaps on front/back panels: half of width
  const sideFlapHeight = width / 2;           // Flaps on side panels: half of length
  
  const glueFlapWidth = 35.5;  
  const glueFlapTopY = y + 12;
  const glueFlapBottomY = y + height - 12;
  
  // Offsets
  const bleedOffset = 4;       
  const creaseOffset = 1;      
  const creaseOffsetX = 2.5;   
  
  // Calculate key positions
  const leftGlueX = x - glueFlapWidth;
  const leftSideX = x;
  const frontX = leftSideX + length;
  const rightSideX = frontX + width;
  const backX = rightSideX + length;
  const endX = backX + width;
  
  // Calculate flap Y positions
  const leftSideTopFlapY = y - sideFlapHeight;
  const frontTopFlapY = y - frontBackFlapHeight;
  const rightSideTopFlapY = y - sideFlapHeight;
  const backTopFlapY = y - frontBackFlapHeight;
  
  const leftSideBottomFlapY = y + height + sideFlapHeight;
  const frontBottomFlapY = y + height + frontBackFlapHeight;
  const rightSideBottomFlapY = y + height + sideFlapHeight;
  const backBottomFlapY = y + height + frontBackFlapHeight;

  // Manual DXF generation
  let dxfContent = '';

  // Header Section
  dxfContent += '0\nSECTION\n';
  dxfContent += '2\nHEADER\n';
  dxfContent += '9\n$ACADVER\n1\nAC1015\n';
  dxfContent += '9\n$INSUNITS\n70\n4\n';
  dxfContent += '0\nENDSEC\n';

  // Tables Section
  dxfContent += '0\nSECTION\n';
  dxfContent += '2\nTABLES\n';
  
  // Layer Table
  dxfContent += '0\nTABLE\n';
  dxfContent += '2\nLAYER\n';
  dxfContent += '70\n4\n';

  // TRIM_LINE layer (Blue - #4E33BA)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nTRIM_LINE\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n5\n';
  dxfContent += '6\nCONTINUOUS\n';

  // CREASE_LINE layer (Red - #FF0000)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nCREASE_LINE\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n1\n';
  dxfContent += '6\nDASHED\n';

  // BLEED_LINE layer (Green - #4CBA33)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nBLEED_LINE\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n3\n';
  dxfContent += '6\nCONTINUOUS\n';

  // BASE_PANEL layer (Red dashed)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nBASE_PANEL\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n1\n';
  dxfContent += '6\nDASHED\n';

  dxfContent += '0\nENDTAB\n';
  dxfContent += '0\nENDSEC\n';

  // Entities Section
  dxfContent += '0\nSECTION\n';
  dxfContent += '2\nENTITIES\n';

  // Helper function to add LWPOLYLINE
  const addPolyline = (points, layer, closed = true) => {
    dxfContent += '0\nLWPOLYLINE\n';
    dxfContent += '8\n' + layer + '\n';
    dxfContent += '90\n' + points.length + '\n';
    dxfContent += '70\n' + (closed ? '1' : '0') + '\n';
    
    points.forEach(([px, py]) => {
      dxfContent += '10\n' + px.toFixed(4) + '\n';
      dxfContent += '20\n' + py.toFixed(4) + '\n';
    });
  };

  // Helper function to add LINE
  const addLine = (x1, y1, x2, y2, layer) => {
    dxfContent += '0\nLINE\n';
    dxfContent += '8\n' + layer + '\n';
    dxfContent += '10\n' + x1.toFixed(4) + '\n';
    dxfContent += '20\n' + y1.toFixed(4) + '\n';
    dxfContent += '11\n' + x2.toFixed(4) + '\n';
    dxfContent += '21\n' + y2.toFixed(4) + '\n';
  };

  // TRIM LINE - Exact match to SVG createTrimLine()
  const trimLinePoints = [
    // Start at top-left of glue flap
    [leftGlueX, glueFlapTopY],
    
    // Down to top-left of left side panel (diagonal)
    [x, y],
    
    // Down to top flap of left side panel
    [x, leftSideTopFlapY],
    
    // Across top of left side flap
    [frontX - creaseOffsetX, leftSideTopFlapY],
    
    // V-notch transition to front panel flap
    [frontX - creaseOffsetX, y - creaseOffset],
    [frontX, y],
    [frontX + creaseOffsetX, y - creaseOffset],
    [frontX + creaseOffsetX, frontTopFlapY],
    
    // Across top of front flap
    [rightSideX - creaseOffsetX, frontTopFlapY],
    
    // V-notch transition to right side panel flap
    [rightSideX - creaseOffsetX, y - creaseOffset],
    [rightSideX, y],
    [rightSideX + creaseOffsetX, y - creaseOffset],
    [rightSideX + creaseOffsetX, rightSideTopFlapY],
    
    // Across top of right side flap
    [backX - creaseOffsetX, rightSideTopFlapY],
    
    // V-notch transition to back panel flap
    [backX - creaseOffsetX, y - creaseOffset],
    [backX, y],
    [backX + creaseOffsetX, y - creaseOffset],
    [backX + creaseOffsetX, backTopFlapY],
    
    // Across top of back flap to right edge
    [endX - creaseOffsetX, backTopFlapY],
    [endX - creaseOffsetX, y - creaseOffset],
    [endX, y],
    [endX, y + 1],
    
    // Down right side of back panel
    [endX, y + height - 1],
    [endX - creaseOffsetX, y + height + creaseOffset],
    
    // Down to bottom flap of back panel
    [endX - creaseOffsetX, backBottomFlapY],
    
    // Across bottom flaps from right to left
    [backX + creaseOffsetX, backBottomFlapY],
    [backX + creaseOffsetX, y + height + creaseOffset],
    [backX, y + height],
    [backX - creaseOffsetX, y + height + creaseOffset],
    [backX - creaseOffsetX, rightSideBottomFlapY],
    
    // Bottom of right side flap
    [rightSideX + creaseOffsetX, rightSideBottomFlapY],
    [rightSideX + creaseOffsetX, y + height + creaseOffset],
    [rightSideX, y + height],
    [rightSideX - creaseOffsetX, y + height + creaseOffset],
    [rightSideX - creaseOffsetX, backBottomFlapY],
    
    // Bottom of front flap
    [frontX + creaseOffsetX, backBottomFlapY],
    [frontX + creaseOffsetX, y + height + creaseOffset],
    [frontX, y + height],
    [frontX - creaseOffsetX, y + height + creaseOffset],
    [frontX - creaseOffsetX, rightSideBottomFlapY],
    
    // Bottom of left side flap
    [x + creaseOffsetX, rightSideBottomFlapY],
    [x + creaseOffsetX, y + height + creaseOffset],
    [x, y + height],
    
    // Up to bottom of main panel
    [x, y + height - creaseOffset],
    
    // Glue flap bottom diagonal
    [leftGlueX, glueFlapBottomY],
    
    // Glue flap left side up
    [leftGlueX, glueFlapTopY]
  ];
  
  addPolyline(trimLinePoints, 'TRIM_LINE', true);

  // BLEED LINE - Exact match to SVG createBleedLine()
  const bleedAdj = 1.25;
  
  const bleedLinePoints = [
    [x - bleedOffset - bleedAdj, y],
    [x - bleedOffset - bleedAdj, y - bleedOffset],
    [x - bleedOffset, y - bleedOffset],
    [x - bleedOffset, leftSideTopFlapY - bleedOffset],
    [frontX, leftSideTopFlapY - bleedOffset],
    [frontX, y - frontBackFlapHeight - bleedOffset],
    [rightSideX, y - frontBackFlapHeight - bleedOffset],
    [rightSideX, y - sideFlapHeight - bleedOffset],
    [backX, y - sideFlapHeight - bleedOffset],
    [backX, y - frontBackFlapHeight - bleedOffset],
    [endX + bleedAdj + 2, y - frontBackFlapHeight - bleedOffset],
    [endX + bleedAdj + 2, y - bleedOffset],
    [endX + bleedOffset + bleedAdj, y - bleedOffset],
    [endX + bleedOffset + bleedAdj, y + height + bleedAdj + 2],
    [endX + bleedOffset - 2, y + height + bleedAdj + 2],
    [endX + bleedOffset - 2, backBottomFlapY + bleedOffset],
    [backX, backBottomFlapY + bleedOffset],
    [backX, rightSideBottomFlapY + bleedOffset],
    [rightSideX, rightSideBottomFlapY + bleedOffset],
    [rightSideX, backBottomFlapY + bleedOffset],
    [frontX, backBottomFlapY + bleedOffset],
    [frontX, rightSideBottomFlapY + bleedOffset],
    [x - bleedAdj, rightSideBottomFlapY + bleedOffset],
    [x - bleedAdj, y + height + bleedOffset],
    [x - bleedOffset - bleedAdj, y + height + bleedOffset],
    [x - bleedOffset - bleedAdj, y + height],
    [x - bleedOffset - bleedAdj, y]
  ];
  
  addPolyline(bleedLinePoints, 'BLEED_LINE', true);

  // BASE PANEL RECTANGLE
  const basePanelWidth = length * 2 + width * 2;
  addLine(x, y, x + basePanelWidth, y, 'BASE_PANEL');
  addLine(x + basePanelWidth, y, x + basePanelWidth, y + height, 'BASE_PANEL');
  addLine(x + basePanelWidth, y + height, x, y + height, 'BASE_PANEL');
  addLine(x, y + height, x, y, 'BASE_PANEL');

  // CREASE LINES - Vertical
  addLine(x + length, y, x + length, y + height, 'CREASE_LINE');
  addLine(x + length + width, y, x + length + width, y + height, 'CREASE_LINE');
  addLine(x + (length * 2) + width, y, x + (length * 2) + width, y + height, 'CREASE_LINE');

  // End entities section
  dxfContent += '0\nENDSEC\n';
  
  // End of file
  dxfContent += '0\nEOF\n';

  return dxfContent;
}