import { GoogleGenAI } from "@google/genai";
import { definedBoxes } from "../config/fefco.js";
import axios from "axios";



export const productAnalyze = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        message: "Image url is required",
        success: false,
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = imageResponse.data;
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: "image/jpeg",
              },
            },
            {
              text: `You are a packaging expert analyzing a product image.

IMAGE COMPOSITION RULE (VERY IMPORTANT):
- The image ALWAYS contains exactly TWO objects:
  1. ONE main product intended for packaging
  2. ONE reference object used ONLY for size comparison

REFERENCE OBJECT RULE:
- The reference object may be an ATM card, coin, ruler, or small 2×2 box
- The reference object is NOT the product
- IGNORE the reference object completely
- Do NOT identify, describe, or mention the reference object

PRODUCT IDENTIFICATION RULE:
- The product is the object that is:
  - Larger than the reference object
  - The actual consumer item
  - Intended to be packed and shipped

TASKS:
1. Identify ONLY the main product
2. Estimate its fragility (Low / Medium / High)
3. Recommend the best FEFCO box ONLY from this list: ${definedBoxes}

DECISION RULES:
- Balance protection and cost
- Avoid over-packaging
- Consider transport durability

STRICT OUTPUT RULES:
- No markdown
- No explanations outside JSON
- No mention of reference objects

Respond ONLY in valid JSON:
{
  "productName": "",
  "fragilityLevel": "",
  "recommendedFefcoBox": "",
  "reasoning": ""
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

    let parsedData= JSON.parse(rawData);
    return res.status(200).json({
      data: parsedData,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Something went wrong",
      success: false,
    });
  }
};
