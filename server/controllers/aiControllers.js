import { GoogleGenAI } from "@google/genai";
import { definedBoxes } from "../config/fefco.js";
import axios from "axios";

export const productAnalyze = async (req, res) => {
  try {
    const { imageUrl1, imageUrl2, dimension, dimensions } = req.body;
    const resolvedDimensions = dimension ?? dimensions;

    if (!imageUrl1 || !imageUrl2) {
      return res.status(400).json({
        message: "",
        success: false,
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const imageResponse1 = await axios.get(imageUrl1, {
      responseType: "arraybuffer",
    });
    const imageResponse2 = await axios.get(imageUrl2, {
      responseType: "arraybuffer",
    });
    const imageBuffer1 = imageResponse1.data;
    const base64Image1 = Buffer.from(imageBuffer1).toString("base64");

    const imageBuffer2 = imageResponse2.data;
    const base64Image2 = Buffer.from(imageBuffer2).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image1,
                mimeType: "image/jpeg",
              },
            },
            {
              inlineData: {
                data: base64Image2,
                mimeType: "image/jpeg",
              },
            },
            {
              text: `You are a packaging expert analyzing a product using TWO images and physical dimensions.

IMAGE INPUT RULES (VERY IMPORTANT):
- EXACTLY TWO images are provided:
  1. Image 1: TOP VIEW of the product
  2. Image 2: SIDE VIEW of the SAME product
- Each image contains:
  - ONE main product intended for packaging
  - ONE reference object used ONLY for size comparison

REFERENCE OBJECT RULE:
- The reference object may be an ATM card, coin, or small 2×2 box
- The reference object is NOT the product
- IGNORE the reference object completely in BOTH images
- Do NOT identify, describe, or mention the reference object

PRODUCT IDENTIFICATION RULE:
- The product is the object that:
  - Appears in BOTH images
  - Is larger than the reference object
  - Is the consumer item intended to be packed and shipped

PHYSICAL DATA PROVIDED:
- Product dimensions (in millimeters): ${resolvedDimensions}
  Format: Length × Width × Height (mm)

WEIGHT ESTIMATION RULE:
- Estimate product weight based on:
  - Product category
  - Typical material assumptions
  - Given dimensions
- Weight is an APPROXIMATION
- Return weight in grams and dont mention unit in the response

TASKS:
1. Identify the main product using BOTH images
2. Estimate fragility (Low / Medium / High)
3. Estimate product weight
4. Recommend the best FEFCO box ONLY from this list: ${definedBoxes}

DECISION RULES:
- Balance protection and cost
- Avoid over-packaging
- Consider transport durability

STRICT OUTPUT RULES:
- No markdown
- No extra text
- No mention of reference objects

Respond ONLY in valid JSON:
{
  "productName": "",
  "fragilityLevel": "",
  "estimatedWeight": "",
  "recommendedFefcoBox": ""
}
`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 500,
      },
    });

    const rawData = response.text;
    if (!rawData) {
      return res.status(500).json({
        message: "AI response not found",
        success: false,
      });
    }

    let parsedData = JSON.parse(rawData);
    return res.status(200).json({
      data: parsedData,
      success: true,
      message: "Ai response found",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};
