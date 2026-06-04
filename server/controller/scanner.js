const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
require("dotenv").config();

const router = express.Router();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/api/scan", upload.single("xray"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No X-ray image uploaded" });
    }

    const base64Image = req.file.buffer.toString("base64");
    const mediaType = req.file.mimetype;

    const prompt = `
You are an AI medical image analysis assistant.

Analyze this X-ray image for demo/educational purpose only.

Return ONLY valid JSON:
{
  "patientInfo": {
    "imageType": "",
    "quality": "",
    "date": ""
  },
  "findings": [
    {
      "region": "",
      "observation": "",
      "severity": ""
    }
  ],
  "impression": "",
  "severity": "",
  "recommendations": [],
  "followUp": "",
  "disclaimer": "This AI result is for educational/demo purposes only and is not a medical diagnosis. Please consult a qualified doctor."
}
`;

    const response =await client.chat.completions.create({
     model: "anthropic/claude-sonnet-4.6",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: [
            {
  type: "image_url",
  image_url: {
    url: `data:${mediaType};base64,${base64Image}`,
  },
},
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });
const rawText = response.choices[0].message.content.trim();

    let report;

    try {
      report = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("AI response is not valid JSON");
      }

      report = JSON.parse(jsonMatch[0]);
    }

    res.status(200).json({
      success: true,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      report,
    });
  } catch (err) {
    console.error("Scan error:", err);

    res.status(500).json({
      success: false,
      error: err.message || "X-ray scan failed",
    });
  }
});

module.exports = router;