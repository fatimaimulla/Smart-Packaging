function pickHeightFromSide(topDims, sideDims) {
  const topValues = [topDims.width_mm, topDims.height_mm];

  const sideValues = [sideDims.width_mm, sideDims.height_mm];

  let bestMatch = Infinity;
  let matchedSideIndex = 0;

  sideValues.forEach((sideVal, i) => {
    topValues.forEach((topVal) => {
      const diff = Math.abs(sideVal - topVal);
      if (diff < bestMatch) {
        bestMatch = diff;
        matchedSideIndex = i;
      }
    });
  });

  // return the OTHER side value
  return sideValues[matchedSideIndex === 0 ? 1 : 0];
}

export default pickHeightFromSide;