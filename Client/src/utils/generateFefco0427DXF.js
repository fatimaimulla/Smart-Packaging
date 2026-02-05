export function generateFefco0427DXF(props) {
  const x = 130.5;
  const y = 271.5;
  const length = props.length || 368;
  const height = props.height || 72;
  const width = props.width || 236;
  const hole_height = 6;
  const hole_width = width / 5;
  
  const leftSideX = x;
  const frontX = leftSideX + width;
  const rightSideX = frontX + height;
  const backX = rightSideX + width + 1;
  const endX = backX + height;
  
  const creaseOffset = 2;
  const trimOffset = 3;
  const foldOffset = 4;
  const flapOffset = 20;
  const leftEdgeX = x - height;
  const lowerY = y + length;
  const midFlap = lowerY + height;
  const creaseBetween = 6;
  const loweryEdge = midFlap + creaseBetween + height - creaseOffset;
  const midY = y + (length / 2);
  const upperEgde = y - (2 * height) - creaseBetween + creaseOffset;
  const flapY = lowerY - hole_height + height;
  const flapHeightBeforeCurve = flapY - 12;
  const upperY = y - height;
  const flapHeightBeforeCurveUp = upperY + hole_height + 12;
  const flapYupper = y + hole_height - height;

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
  dxfContent += '70\n5\n';

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

  // HOLES layer (Blue)
  dxfContent += '0\nLAYER\n';
  dxfContent += '2\nHOLES\n';
  dxfContent += '70\n0\n';
  dxfContent += '62\n5\n';
  dxfContent += '6\nCONTINUOUS\n';

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

  // ===== TRIM LINE - LOWER HALF =====
  const trimLowerPoints = [
    [leftEdgeX, midY],
    [leftEdgeX, midFlap + flapOffset],
    [leftSideX - trimOffset, midFlap + flapOffset],
    [leftSideX - trimOffset, lowerY - trimOffset],
    [leftSideX, lowerY - trimOffset],
    [leftSideX, midFlap],
    [x + creaseOffset, midFlap + creaseBetween],
    [x + creaseOffset, loweryEdge],
    [leftSideX + hole_width + creaseOffset, loweryEdge],
    [leftSideX + hole_width + foldOffset, loweryEdge + foldOffset],
    [leftSideX + (hole_width * 2) - creaseOffset, loweryEdge + foldOffset],
    [leftSideX + (hole_width * 2), loweryEdge],
    [leftSideX + (hole_width * 3), loweryEdge],
    [leftSideX + (hole_width * 3) + creaseOffset, loweryEdge + foldOffset],
    [leftSideX + (hole_width * 4) - trimOffset, loweryEdge + foldOffset],
    [leftSideX + (hole_width * 4), loweryEdge],
    [frontX - creaseOffset, loweryEdge],
    [frontX - creaseOffset, midFlap + creaseBetween],
    [frontX, midFlap],
    [frontX, lowerY - creaseOffset],
    [frontX + trimOffset, lowerY - creaseOffset],
    [frontX + trimOffset, midFlap + flapOffset],
    [rightSideX - 1, midFlap + flapOffset],
    [rightSideX - 1, lowerY - foldOffset - 2],
    [rightSideX + creaseOffset, lowerY - foldOffset - 2],
    [rightSideX + flapOffset + creaseOffset, flapHeightBeforeCurve],
    // Curve approximation (simplified to line for DXF compatibility)
    [rightSideX + flapOffset + creaseOffset + 16, flapY - 1],
    [backX - creaseOffset - flapOffset - 14, flapY - 1],
    // Curve approximation
    [backX - flapOffset - creaseOffset, flapHeightBeforeCurve],
    [backX, lowerY - hole_height],
    [backX + creaseOffset, lowerY - hole_height],
    [backX + creaseOffset, flapY - foldOffset],
    // Curve approximation
    [endX, 648],
    [endX, lowerY],
    [endX + 1, lowerY - foldOffset],
    [endX + 1, midY]
  ];
  addPolyline(trimLowerPoints, 'TRIM_LINE', false);

  // ===== TRIM LINE - UPPER HALF =====
  const trimUpperPoints = [
    [leftEdgeX, midY],
    [leftEdgeX, upperY - flapOffset],
    [leftSideX - trimOffset, upperY - flapOffset],
    [leftSideX - trimOffset, y + trimOffset],
    [leftSideX, y + trimOffset],
    [leftSideX, y - height],
    [x + creaseOffset, y - height - creaseBetween],
    [x + creaseOffset, upperEgde],
    [leftSideX + hole_width + creaseOffset, upperEgde],
    [leftSideX + hole_width + foldOffset, upperEgde - foldOffset],
    [leftSideX + (hole_width * 2) - creaseOffset, upperEgde - foldOffset],
    [leftSideX + (hole_width * 2), upperEgde],
    [leftSideX + (hole_width * 3), upperEgde],
    [leftSideX + (hole_width * 3) + creaseOffset, upperEgde - foldOffset],
    [leftSideX + (hole_width * 4) - trimOffset, upperEgde - foldOffset],
    [leftSideX + (hole_width * 4), upperEgde],
    [frontX - creaseOffset, upperEgde],
    [frontX - creaseOffset, y - height - creaseBetween],
    [frontX, y - height],
    [frontX, y + creaseOffset],
    [frontX + trimOffset, y + creaseOffset],
    [frontX + trimOffset, upperY - flapOffset],
    [rightSideX - 1, upperY - flapOffset],
    [rightSideX - 1, y + hole_height],
    [rightSideX + creaseOffset, y + hole_height],
    [rightSideX + flapOffset + creaseOffset, flapHeightBeforeCurveUp],
    // Curve approximation
    [rightSideX + flapOffset + creaseOffset + 16, 207],
    [backX - creaseOffset - flapOffset - 16, 207],
    // Curve approximation
    [backX - flapOffset - creaseOffset, flapHeightBeforeCurveUp],
    [backX, y + hole_height],
    [backX + creaseOffset, y + hole_height],
    [backX + creaseOffset, flapYupper + foldOffset],
    // Curve approximation
    [endX, 263.5],
    [endX, y],
    [endX + 1, 276.5],
    [endX + 1, midY]
  ];
  addPolyline(trimUpperPoints, 'TRIM_LINE', false);

  // ===== BASE PANELS (CREASE RECTANGLES) =====
  addRect(x, y, width, length, 'BASE_PANEL');
  addRect(rightSideX, y + creaseOffset + foldOffset, width + creaseOffset, length - (hole_height * 2), 'BASE_PANEL');

  // ===== CREASE LINES =====
  // Left to rectangle top and bottom
  addLine(leftSideX - height + creaseOffset, y + creaseOffset, x - creaseOffset, y + creaseOffset, 'CREASE_LINE');
  addLine(leftSideX - height + creaseOffset, lowerY - creaseOffset, x - creaseOffset, lowerY - creaseOffset, 'CREASE_LINE');

  // Right to rectangle top and bottom
  addLine(backX + creaseOffset, y + creaseOffset, endX, y + creaseOffset, 'CREASE_LINE');
  addLine(backX + creaseOffset, y + length - creaseOffset, endX, y + length - creaseOffset, 'CREASE_LINE');

  // Between rectangle top and bottom
  addLine(frontX + creaseOffset, lowerY - creaseOffset, rightSideX, lowerY - creaseOffset, 'CREASE_LINE');
  addLine(frontX + creaseOffset, y + creaseOffset, rightSideX, y + creaseOffset, 'CREASE_LINE');

  // Bottom of left crease
  addLine(x, lowerY + height, frontX, lowerY + height, 'CREASE_LINE');
  addLine(x + creaseOffset, lowerY + height + creaseOffset + foldOffset + 1, frontX - creaseOffset, lowerY + height + creaseOffset + foldOffset + 1, 'CREASE_LINE');

  // Top of left crease
  addLine(x, y - height, frontX, y - height, 'CREASE_LINE');
  addLine(x + creaseOffset, y - height - creaseOffset - foldOffset - 1, frontX - creaseOffset, y - height - creaseOffset - foldOffset - 1, 'CREASE_LINE');

  // ===== LOCKING HOLES =====
  addRect(x + hole_width, y, hole_width, hole_height, 'HOLES');
  addRect(x + (hole_width * 3), y, hole_width, hole_height, 'HOLES');
  addRect(x + hole_width, lowerY - hole_height, hole_width, hole_height, 'HOLES');
  addRect(x + (hole_width * 3), lowerY - hole_height, hole_width, hole_height, 'HOLES');

  // End entities section
  dxfContent += '0\nENDSEC\n';
  
  // End of file
  dxfContent += '0\nEOF\n';

  return dxfContent;
}