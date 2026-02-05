export function generateFefco0201DXF(props) {
  const x = props.x || 100;
  const y = props.y || 200;
  const length = props.length || 191;
  const width = props.width || 383;
  const height = props.height || 245;

  const glueFlapWidth = 40;
  const topFlapY = y - length / 2;
  const bottomFlapY = y + height + length / 2;
  const bleedOffset = 5;
  const creaseOffset = 1;

  // Calculate key positions
  const panel1X = x + glueFlapWidth;
  const panel2X = panel1X + width;
  const panel3X = panel2X + length;
  const panel4X = panel3X + width;
  const panel5X = panel4X + length;

  // Manual DXF generation for maximum compatibility
  let dxfContent = '';

  // Header Section
  dxfContent += '0\nSECTION\n';
  dxfContent += '2\nHEADER\n';
  dxfContent += '9\n$ACADVER\n1\nAC1015\n';
  dxfContent += '9\n$INSUNITS\n70\n4\n'; // Millimeters
  dxfContent += '0\nENDSEC\n';

  // Tables Section
  dxfContent += '0\nSECTION\n';
  dxfContent += '2\nTABLES\n';
  
  // Layer Table
  dxfContent += '0\nTABLE\n';
  dxfContent += '2\nLAYER\n';
  dxfContent += '70\n4\n'; // 4 layers

  // TRIM_LINE layer (Blue - #343CB7)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nTRIM_LINE\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n5\n'; // Blue color
  dxfContent += '6\nCONTINUOUS\n';

  // CREASE_LINE layer (Red - #FC0707)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nCREASE_LINE\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n1\n'; // Red color
  dxfContent += '6\nDASHED\n';

  // BLEED_LINE layer (Green - #A2D68E)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nBLEED_LINE\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n3\n'; // Green color
  dxfContent += '6\nCONTINUOUS\n';

  // BASE_PANEL layer (Red dashed)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nBASE_PANEL\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n1\n'; // Red color
  dxfContent += '6\nDASHED\n';

  dxfContent += '0\nENDTAB\n';
  dxfContent += '0\nENDSEC\n';

  // Entities Section
  dxfContent += '0\nSECTION\n';
  dxfContent += '2\nENTITIES\n';

  // Helper function to add LWPOLYLINE (matches SVG paths)
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
    [x, y],
    
    // Down to top flap line
    [x, topFlapY],
    
    // Panel 1 (Left side panel) top tab
    [panel2X - 2.5, topFlapY],
    [panel2X - 2.5, y - creaseOffset],
    [panel2X, y],
    [panel2X + 2.5, y - creaseOffset],
    [panel2X + 2.5, topFlapY],
    
    // Panel 2 (Front panel) top tab
    [panel3X - 2.5, topFlapY],
    [panel3X - 2.5, y - creaseOffset],
    [panel3X, y],
    [panel3X + 2.5, y - creaseOffset],
    [panel3X + 2.5, topFlapY],
    
    // Panel 3 (Back panel) top tab
    [panel4X - 2.5, topFlapY],
    [panel4X - 2.5, y - creaseOffset],
    [panel4X, y],
    [panel4X + 2.5, y - creaseOffset],
    [panel4X + 2.5, topFlapY],
    
    // Panel 4 (Right side panel) top tab
    [panel5X - glueFlapWidth - 2.5, topFlapY],
    [panel5X - glueFlapWidth - 2.5, y - creaseOffset],
    [panel5X - glueFlapWidth, y],
    [panel5X - glueFlapWidth + 1, y + 1],
    
    // Down right side
    [panel5X - glueFlapWidth + 1, y + height - 1],
    [panel5X - glueFlapWidth, y + height],
    
    // Bottom flap right side
    [panel5X - glueFlapWidth, bottomFlapY],
    
    // Back across bottom flaps (right to left)
    [panel4X + 2.5, bottomFlapY],
    [panel4X + 2.5, y + height + creaseOffset],
    [panel4X, y + height],
    [panel4X - 2.5, y + height + creaseOffset],
    [panel4X - 2.5, bottomFlapY],
    
    [panel3X + 2.5, bottomFlapY],
    [panel3X + 2.5, y + height + creaseOffset],
    [panel3X, y + height],
    [panel3X - 2.5, y + height + creaseOffset],
    [panel3X - 2.5, bottomFlapY],
    
    [panel2X + 2.5, bottomFlapY],
    [panel2X + 2.5, y + height + creaseOffset],
    [panel2X, y + height],
    [panel2X - 2.5, y + height + creaseOffset],
    [panel2X - 2.5, bottomFlapY],
    
    [x, bottomFlapY],
    [x, y + height - creaseOffset],
    
    // Glue flap bottom diagonal
    [x - glueFlapWidth, y + height - 12],
    
    // Glue flap left side
    [x - glueFlapWidth, y + 12],
    
    // Glue flap top diagonal (closes the path back to start)
    [x, y]
  ];
  
  addPolyline(trimLinePoints, 'TRIM_LINE', true);

  // BLEED LINE - Exact match to SVG createBleedLine()
  const bleedLinePoints = [
    [x - bleedOffset - 3, y],
    [x - bleedOffset - 3, y - bleedOffset],
    [x - bleedOffset, y - bleedOffset],
    [x - bleedOffset, topFlapY - bleedOffset],
    [panel5X - glueFlapWidth + 3, topFlapY - bleedOffset],
    [panel5X - glueFlapWidth + 3, y - bleedOffset],
    [panel5X - glueFlapWidth + bleedOffset + 3, y - bleedOffset],
    [panel5X - glueFlapWidth + bleedOffset + 3, y + height + 3],
    [panel5X - glueFlapWidth + bleedOffset, y + height + 3],
    [panel5X - glueFlapWidth + bleedOffset, bottomFlapY + bleedOffset],
    [x - bleedOffset, bottomFlapY + bleedOffset],
    [x - bleedOffset, y + height + bleedOffset],
    [x - bleedOffset - 3, y + height + bleedOffset],
    [x - bleedOffset - 3, y + height],
    [x - bleedOffset - 3, y]
  ];
  
  addPolyline(bleedLinePoints, 'BLEED_LINE', true);

  // BASE PANEL RECTANGLE - Exact match to SVG rect
  const basePanelWidth = panel5X - glueFlapWidth - x + 1;
  addLine(x, y, x + basePanelWidth, y, 'BASE_PANEL');
  addLine(x + basePanelWidth, y, x + basePanelWidth, y + height, 'BASE_PANEL');
  addLine(x + basePanelWidth, y + height, x, y + height, 'BASE_PANEL');
  addLine(x, y + height, x, y, 'BASE_PANEL');

  // CREASE LINES - Vertical (exact match to SVG lines)
  addLine(panel2X, y - 0.5, panel2X, y + height - 0.5, 'CREASE_LINE');
  addLine(panel3X, y - 0.5, panel3X, y + height - 0.5, 'CREASE_LINE');
  addLine(panel4X, y - 0.5, panel4X, y + height - 0.5, 'CREASE_LINE');

  // End entities section
  dxfContent += '0\nENDSEC\n';
  
  // End of file
  dxfContent += '0\nEOF\n';

  return dxfContent;
}