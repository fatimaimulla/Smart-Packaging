export function generateFefco0401DXF(props) {
  // Parameters 
  const x = props.x || 541.5;
  const y = props.y || 469.5;
  const length = props.length || 400; // horizontal
  const width = props.width || 250;   // vertical   
  const height = props.height || 150; // straight up 
  
  // Base Panel Position
  const baseX = x;
  const baseY = y;

  // Crease Line Dimension
  const topCreaseY = baseY - height;
  const bottomCreaseY = baseY + width + height;
  const leftCreaseX = baseX - height;
  const rightCreaseX = baseX + length + height;

  // Flap Dimension
  const verticalFlap = height + width / 2;
  const horizontalFlap = height + 0.4 * length;

  // Trim Boundaries
  const trimTop = baseY - verticalFlap;
  const trimBottom = baseY + width + verticalFlap;
  const trimLeft = baseX - horizontalFlap;
  const trimRight = baseX + length + horizontalFlap;

  // Bleed Offset
  const bleedOffset = 5;

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

  // TRIM_LINE layer (Blue - #343CB7)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nTRIM_LINE\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n5\n';
  dxfContent += '6\nCONTINUOUS\n';

  // CREASE_LINE layer (Red - #FC0707)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nCREASE_LINE\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n1\n';
  dxfContent += '6\nDASHED\n';

  // BLEED_LINE layer (Green - #A2D68E)
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

  // Helper function to add RECTANGLE
  const addRect = (rx, ry, rwidth, rheight, layer) => {
    addLine(rx, ry, rx + rwidth, ry, layer);
    addLine(rx + rwidth, ry, rx + rwidth, ry + rheight, layer);
    addLine(rx + rwidth, ry + rheight, rx, ry + rheight, layer);
    addLine(rx, ry + rheight, rx, ry, layer);
  };

  // ===== TRIM LINE - Exact match to SVG =====
  const trimLinePoints = [
    // Start at top-left of top flap
    [baseX, trimTop],
    
    // Top flap
    [baseX + length, trimTop],
    
    // Right side
    [baseX + length, baseY],
    [trimRight, baseY],
    [trimRight, baseY + width],
    
    // Bottom flap
    [baseX + length, baseY + width],
    [baseX + length, trimBottom],
    [baseX, trimBottom],
    
    // Left side
    [baseX, baseY + width],
    [trimLeft, baseY + width],
    [trimLeft, baseY],
    
    // Close
    [baseX, baseY],
    [baseX, trimTop]
  ];
  addPolyline(trimLinePoints, 'TRIM_LINE', true);

  // ===== BLEED LINE - Exact match to SVG =====
  const bleedLinePoints = [
    [baseX - bleedOffset, trimTop - bleedOffset],
    [baseX + length + bleedOffset, trimTop - bleedOffset],
    [baseX + length + bleedOffset, baseY - bleedOffset],
    [trimRight + bleedOffset, baseY - bleedOffset],
    [trimRight + bleedOffset, baseY + width + bleedOffset],
    [baseX + length + bleedOffset, baseY + width + bleedOffset],
    [baseX + length + bleedOffset, trimBottom + bleedOffset],
    [baseX - bleedOffset, trimBottom + bleedOffset],
    [baseX - bleedOffset, baseY + width + bleedOffset],
    [trimLeft - bleedOffset, baseY + width + bleedOffset],
    [trimLeft - bleedOffset, baseY - bleedOffset],
    [baseX - bleedOffset, baseY - bleedOffset],
    [baseX - bleedOffset, trimTop - bleedOffset]
  ];
  addPolyline(bleedLinePoints, 'BLEED_LINE', true);

  // ===== BASE PANEL =====
  addRect(baseX, baseY, length, width, 'BASE_PANEL');

  // ===== CREASE LINES =====
  // Top crease
  addLine(baseX, topCreaseY, baseX + length, topCreaseY, 'CREASE_LINE');
  
  // Bottom crease
  addLine(baseX, bottomCreaseY, baseX + length, bottomCreaseY, 'CREASE_LINE');
  
  // Left crease
  addLine(leftCreaseX, baseY, leftCreaseX, baseY + width, 'CREASE_LINE');
  
  // Right crease
  addLine(rightCreaseX, baseY, rightCreaseX, baseY + width, 'CREASE_LINE');

  // End entities section
  dxfContent += '0\nENDSEC\n';
  
  // End of file
  dxfContent += '0\nEOF\n';

  return dxfContent;
}