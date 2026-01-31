const CREDIT_CARD_WIDTH_MM = 85.6;
const CREDIT_CARD_HEIGHT_MM = 53.98;
const COIN_DIAMETER_MM = 27.0;

function computeMmPerPixel(referenceBox, referenceType) {
  const { w: refWpx, h: refHpx } = referenceBox;

  let refRealMm;
  let refPixel;

  if (referenceType === "ATM card") {
    // choose longer side automatically
    if (refWpx >= refHpx) {
      refRealMm = CREDIT_CARD_WIDTH_MM;
      refPixel = refWpx;
    } else {
      refRealMm = CREDIT_CARD_HEIGHT_MM;
      refPixel = refHpx;
    }
  } else if (referenceType === "coin") {
    // coin uses diameter → max side
    refRealMm = COIN_DIAMETER_MM;
    refPixel = Math.max(refWpx, refHpx);
  } else {
    throw new Error("Invalid reference type");
  }

  if (refPixel <= 0) {
    throw new Error("Invalid reference bounding box");
  }

  return refRealMm / refPixel;
}

function calculateSingleProductDimension(productBox, mmPerPixel) {
  const { w: widthPx, h: heightPx } = productBox;

  return {
    width_mm: Number((widthPx * mmPerPixel).toFixed(2)),
    height_mm: Number((heightPx * mmPerPixel).toFixed(2)),
  };
}

export default function CalculateDimension(
  reference_type,
  reference_dimension,
  product_dimension,
) {
  const mmPerPixel = computeMmPerPixel(reference_dimension, reference_type);

  const product = calculateSingleProductDimension(
    product_dimension,
    mmPerPixel,
  );

  return {
    ...product,
  };
}
