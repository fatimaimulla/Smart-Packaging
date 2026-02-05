export function generateFefco0301DXF(props) {
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

  // ===== BOTTOM BOX - TRIM LINE =====
  const trimPoints1 = [
    [x, Y],
    [x, Y - height],
    [x + length, Y - height],
    [x + length, Y],
    [x + length + flapGap, Y],
    [x + length + flapGap, Y - sideflap_height],
    [x + length + flapGap + height, Y - sideflap_height],
    [x + length + flapGap + height, y + width + sideflap_height - creaseInset],
    [x + length + flapGap, y + width + sideflap_height - creaseInset],
    [x + length + flapGap, y + width - creaseInset],
    [x + length, y + width - creaseInset],
    [x + length, y + width + height - creaseInset],
    [x, y + width + height - creaseInset],
    [x, y + width - creaseInset],
    [x - flapGap, y + width - creaseInset],
    [x - flapGap, y + width + sideflap_height - creaseInset],
    [x - flapGap - height, y + width + sideflap_height - creaseInset],
    [x - flapGap - height, y - sideflap_height + creaseInset],
    [x - flapGap, y - sideflap_height + creaseInset],
    [x - flapGap, Y],
    [x, Y]
  ];
  addPolyline(trimPoints1, 'TRIM_LINE', true);

  // ===== TOP BOX - TRIM LINE =====
  const trimPoints2 = [
    [x2, Y2],
    [x2, Y2 - height2],
    [x2 + length2, Y2 - height2],
    [x2 + length2, Y2],
    [x2 + length2 + flapGap, Y2],
    [x2 + length2 + flapGap, Y2 - sideflap_height2],
    [x2 + length2 + flapGap + height2, Y2 - sideflap_height2],
    [x2 + length2 + flapGap + height2, y2 + width2 + sideflap_height2 - creaseInset],
    [x2 + length2 + flapGap, y2 + width2 + sideflap_height2 - creaseInset],
    [x2 + length2 + flapGap, y2 + width2 - creaseInset],
    [x2 + length2, y2 + width2 - creaseInset],
    [x2 + length2, y2 + width2 + height2 - creaseInset],
    [x2, y2 + width2 + height2 - creaseInset],
    [x2, y2 + width2 - creaseInset],
    [x2 - flapGap, y2 + width2 - creaseInset],
    [x2 - flapGap, y2 + width2 + sideflap_height2 - creaseInset],
    [x2 - flapGap - height2, y2 + width2 + sideflap_height2 - creaseInset],
    [x2 - flapGap - height2, y2 - sideflap_height2 + creaseInset],
    [x2 - flapGap, y2 - sideflap_height2 + creaseInset],
    [x2 - flapGap, Y2],
    [x2, Y2]
  ];
  addPolyline(trimPoints2, 'TRIM_LINE', true);

  // ===== BOTTOM BOX - BLEED LINE =====
  const bleedPoints1 = [
    [x - bleed, Y - height - bleed],
    [x + length + bleed, Y - height - bleed],
    [x + length + bleed, Y - sideflap_height - bleed],
    [x + length + flapGap + height + bleed, Y - sideflap_height - bleed],
    [x + length + flapGap + height + bleed, y + width + sideflap_height - creaseInset + bleed],
    [x + length + bleed, y + width + sideflap_height - creaseInset + bleed],
    [x + length + bleed, y + width + height - creaseInset + bleed],
    [x - bleed, y + width + height - creaseInset + bleed],
    [x - bleed, y + width + sideflap_height - creaseInset + bleed],
    [x - flapGap - height - bleed, y + width + sideflap_height - creaseInset + bleed],
    [x - flapGap - height - bleed, Y - sideflap_height - bleed],
    [x - bleed, Y - sideflap_height - bleed],
    [x - bleed, Y - height - bleed]
  ];
  addPolyline(bleedPoints1, 'BLEED_LINE', true);

  // ===== TOP BOX - BLEED LINE =====
  const bleedPoints2 = [
    [x2 - bleed, Y2 - height2 - bleed],
    [x2 + length2 + bleed, Y2 - height2 - bleed],
    [x2 + length2 + bleed, Y2 - sideflap_height2 - bleed],
    [x2 + length2 + flapGap + height2 + bleed, Y2 - sideflap_height2 - bleed],
    [x2 + length2 + flapGap + height2 + bleed, y2 + width2 + sideflap_height2 - creaseInset + bleed],
    [x2 + length2 + bleed, y2 + width2 + sideflap_height2 - creaseInset + bleed],
    [x2 + length2 + bleed, y2 + width2 + height2 - creaseInset + bleed],
    [x2 - bleed, y2 + width2 + height2 - creaseInset + bleed],
    [x2 - bleed, y2 + width2 + sideflap_height2 - creaseInset + bleed],
    [x2 - flapGap - height2 - bleed, y2 + width2 + sideflap_height2 - creaseInset + bleed],
    [x2 - flapGap - height2 - bleed, Y2 - sideflap_height2 - bleed],
    [x2 - bleed, Y2 - sideflap_height2 - bleed],
    [x2 - bleed, Y2 - height2 - bleed]
  ];
  addPolyline(bleedPoints2, 'BLEED_LINE', true);

  // ===== BASE PANELS =====
  addRect(x, y, length, width, 'BASE_PANEL');
  addRect(x2, y2, length2, width2, 'BASE_PANEL');

  // ===== CREASES (BOTTOM BOX) =====
  addLine(x - height, y + creaseInset, x, y + creaseInset, 'CREASE_LINE');
  addLine(x - height, y + width - creaseInset, x, y + width - creaseInset, 'CREASE_LINE');
  addLine(x + length, y + creaseInset, x + length + height, y + creaseInset, 'CREASE_LINE');
  addLine(x + length, y + width - creaseInset, x + length + height, y + width - creaseInset, 'CREASE_LINE');

  // ===== CREASES (TOP BOX) =====
  addLine(x2 - height2, y2 + creaseInset, x2, y2 + creaseInset, 'CREASE_LINE');
  addLine(x2 - height2, y2 + width2 - creaseInset, x2, y2 + width2 - creaseInset, 'CREASE_LINE');
  addLine(x2 + length2, y2 + creaseInset, x2 + length2 + height2, y2 + creaseInset, 'CREASE_LINE');
  addLine(x2 + length2, y2 + width2 - creaseInset, x2 + length2 + height2, y2 + width2 - creaseInset, 'CREASE_LINE');

  // End entities section
  dxfContent += '0\nENDSEC\n';
  
  // End of file
  dxfContent += '0\nEOF\n';

  return dxfContent;
}