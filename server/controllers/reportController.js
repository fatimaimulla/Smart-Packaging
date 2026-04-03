const calculateBoardArea = (l, w, h, fefcoCode) => {
  let area = 0;

  switch (fefcoCode) {
    case "Fefco0201":
      area = (2 * (l + w) + 43) * (2 * h + w + 10);
      break;

    case "Fefco0203":
      area = (2 * (l + w) + 45) * (2 * h + w + 20);
      break;

    case "Fefco0301":
      const bottom = (2 * (l + w) + 43) * (2 * (h * 0.6) + w + 10);
      const top = (2 * (l + w + 6) + 43) * (2 * (h * 0.45) + w + 10);
      area = bottom + top;
      break;

    case "Fefco0401":
      area = (l + 2 * h + 30) * (w + 2 * h + 30);
      break;

    case "Fefco0427":
      area = (l + w + 2 * h + 50) * (w + h + 45);
      break;

    default:
      area = (2 * (l + w) + 43) * (2 * h + w + 10);
  }

  return area / 1_000_000;
};

export const estimatePackagingCost = async (req, res) => {
  try {
    const { length, width, height, productWeight, fragility, fefcoCode } =
      req.body;

    if (!length || !width || !height || !productWeight || !fefcoCode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const parseWeight = parseFloat(productWeight);

    const weight = parseWeight / 1000;
    let ply;
    if (weight <= 5) ply = 3;
    else if (weight <= 20) ply = 5;
    else ply = 7;

    if (fragility === "Medium" && weight >= 3) ply = Math.min(ply + 2, 7);
    if (fragility === "High") ply = Math.min(ply + 2, 7);
    if (ply === 4) ply = 5;
    if (ply === 6) ply = 7;

    let gsm;
    if (ply === 3) gsm = 420;
    else if (ply === 5) gsm = 700;
    else gsm = 980;
    let plythickness = "3 mm";
    if (ply === 5) plythickness = "5–7 mm";
    if (ply === 7) plythickness = "7–10 mm";

    const boardArea = calculateBoardArea(l, w, h, fefcoCode);

    let wastageFactor = 1.05;
    if (fefcoCode === "Fefco0203") wastageFactor = 1.07;
    if (fefcoCode === "Fefco0301") wastageFactor = 1.08;
    if (fefcoCode === "Fefco0401") wastageFactor = 1.06;
    if (fefcoCode === "Fefco0427") wastageFactor = 1.14;

    const finalArea = boardArea * wastageFactor;

    const wasteRatio =
      boardArea > 0 ? ((finalArea - boardArea) / boardArea) * 100 : 0;

    const boardWeightKg = (finalArea * gsm) / 1000;

    const paperRateByPly = { 3: 46, 5: 62, 7: 76 };
    const materialCost = boardWeightKg * paperRateByPly[ply];

    const conversionRateByPly = { 3: 18, 5: 28, 7: 42 };
    const conversionCost = finalArea * conversionRateByPly[ply];

    const subtotal = materialCost + conversionCost;

    const gst = subtotal * 0.12;

    const finalCost = subtotal + gst;

    const materialPercent = ((materialCost / subtotal) * 100).toFixed(0);
    const processPercent = ((conversionCost / subtotal) * 100).toFixed(0);
    const wasteCost = materialCost * (wasteRatio / 100);
    const wastePercent = ((wasteCost / subtotal) * 100).toFixed(0);

    const carbonFactorByPly = { 3: 0.72, 5: 0.95, 7: 1.38 };
    const carbon = boardWeightKg * carbonFactorByPly[ply];
    const standard = boardWeightKg * 3.2;

    const carbonFootprint = carbon.toFixed(4);
    const standardFootprint = standard.toFixed(4);
    const reduction =
      standard > 0 ? (((standard - carbon) / standard) * 100).toFixed(0) : "0";

    const recyclabilityScore = { 3: 9.5, 5: 8.8, 7: 7.5 }[ply];

    const wasteThreshold = {
      Fefco0201: 8,
      Fefco0203: 10,
      Fefco0301: 12,
      Fefco0401: 9,
      Fefco0427: 15,
    };
    const optimalFit = wasteRatio <= (wasteThreshold[fefcoCode] || 10);

    return res.status(200).json({
      success: true,
      data: {
        fefcoCode,
        ply,
        plythickness,
        gsm,
        length:Number(length),
        width:Number(width),
        height:Number(height),
      

        boardArea: boardArea.toFixed(3),
        finalArea: finalArea.toFixed(3),
        wasteRatio: wasteRatio.toFixed(0),

        boardWeightKg: boardWeightKg.toFixed(3),

        materialCost: materialCost.toFixed(2),
        conversionCost: conversionCost.toFixed(2),
        gst: gst.toFixed(2),
        estimatedCostPerBox: finalCost.toFixed(2),

        costBreakdown: {
          materialPercent,
          processPercent,
          wastePercent,
        },

        environment: {
          carbonFootprint,
          standardFootprint,
          reduction,
          recyclabilityScore,
        },

        optimalFit,
      },
    });
  } catch (error) {
    console.error("Cost Estimation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
