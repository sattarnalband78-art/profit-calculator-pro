var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/gemini/advisor", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("[Gemini Advisor] GEMINI_API_KEY environment variable is missing.");
        return res.status(503).json({
          error: "Gemini API key is not configured on server",
          fallback: true,
          success: false
        });
      }
      const {
        productName,
        costPrice,
        sellingPrice,
        quantity,
        totalSales,
        totalCost,
        totalProfit,
        profitPercentage,
        profitMarginOnSales,
        language
      } = req.body;
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      let targetLangName = "English";
      let langInstruction = "Respond ONLY in English. Do not use Hindi or Marathi.";
      let bulletHeaders = {
        status: "Profit Status",
        target: "Sales Target",
        tip: "Business Tip"
      };
      if (language === "hi") {
        targetLangName = "Hindi (\u0939\u093F\u0928\u094D\u0926\u0940)";
        langInstruction = "CRITICAL LANGUAGE REQUIREMENT: You MUST respond 100% EXCLUSIVELY in Hindi (\u0939\u093F\u0928\u094D\u0926\u0940) using Devanagari script. Every sentence, explanation, and word of advice MUST be written in natural, fluent Hindi. DO NOT use English sentences or phrases under any circumstances.";
        bulletHeaders = {
          status: "\u092E\u0941\u0928\u093E\u092B\u093C\u093E \u0938\u094D\u0925\u093F\u0924\u093F",
          target: "\u092C\u093F\u0915\u094D\u0930\u0940 \u0932\u0915\u094D\u0937\u094D\u092F",
          tip: "\u0935\u094D\u092F\u093E\u092A\u093E\u0930\u093F\u0915 \u0938\u0932\u093E\u0939"
        };
      } else if (language === "mr") {
        targetLangName = "Marathi (\u092E\u0930\u093E\u0920\u0940)";
        langInstruction = "CRITICAL LANGUAGE REQUIREMENT: You MUST respond 100% EXCLUSIVELY in Marathi (\u092E\u0930\u093E\u0920\u0940) using Devanagari script. Every sentence, explanation, and word of advice MUST be written in natural, fluent Marathi. DO NOT use English or Hindi sentences under any circumstances.";
        bulletHeaders = {
          status: "\u0928\u092B\u093E \u0938\u094D\u0925\u093F\u0924\u0940",
          target: "\u0935\u093F\u0915\u094D\u0930\u0940 \u0909\u0926\u094D\u0926\u093F\u0937\u094D\u091F",
          tip: "\u0935\u094D\u092F\u093E\u0935\u0938\u093E\u092F\u093F\u0915 \u0938\u0932\u094D\u0932\u093E"
        };
      } else {
        targetLangName = "English";
        langInstruction = "CRITICAL LANGUAGE REQUIREMENT: You MUST respond 100% in clear, professional, practical English.";
        bulletHeaders = {
          status: "Profit Status",
          target: "Sales Target",
          tip: "Business Advice"
        };
      }
      const profitPerPiece = Number(sellingPrice) - Number(costPrice);
      const isProfit = profitPerPiece > 0;
      const isLoss = profitPerPiece < 0;
      const prompt = `You are an expert, practical business advisor for small shopkeepers, traders, and entrepreneurs.

${langInstruction}

Here is the exact financial data for the product:
- Product Name: ${productName || "Product"} (Preserve product name)
- Cost Price per unit: \u20B9${costPrice}
- Selling Price per unit: \u20B9${sellingPrice}
- Quantity: ${quantity} units
- Total Sales Revenue: \u20B9${totalSales}
- Total Cost: \u20B9${totalCost}
- Total ${isProfit ? "Profit" : isLoss ? "Loss" : "Break-Even"}: \u20B9${totalProfit}
- Profit per unit: \u20B9${profitPerPiece}
- Return on Investment (ROI): ${profitPercentage}%
- Profit Margin on Sales: ${profitMarginOnSales}%

TASK:
Provide short, practical, and highly actionable business advice in ${targetLangName}.
Use exactly 3 clean bullet points formatted as follows:
\u2022 **${bulletHeaders.status}**: 1 clear sentence summarizing the current profit/loss condition (\u20B9${profitPerPiece} per piece and \u20B9${totalProfit} total on ${quantity} pieces).
\u2022 **${bulletHeaders.target}**: 1 motivating, specific sentence with a sales volume target (e.g. how many units needed to achieve double profit or reach \u20B92,000 / \u20B95,000 profit).
\u2022 **${bulletHeaders.tip}**: 1 realistic tip on pricing, inventory rotation, batch purchasing, or reducing costs.

STRICT RULES:
1. ${langInstruction}
2. Keep the advice concise and easy to understand for a local business owner.
3. Format all currency amounts with the \u20B9 symbol cleanly (never write duplicate symbols like \u20B9\u20B9).
4. Do not invent any outside numbers.`;
      const candidateModels = [
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-lite-latest",
        "gemini-3.6-flash",
        "gemini-3.7-flash",
        "gemini-flash-latest",
        "gemini-pro-latest"
      ];
      let generatedText = null;
      let usedModel = "";
      let lastError = null;
      for (const model of candidateModels) {
        try {
          console.log(`[Gemini Advisor] Requesting model: ${model}`);
          const response = await ai.models.generateContent({
            model,
            contents: prompt
          });
          if (response && response.text) {
            generatedText = response.text;
            usedModel = model;
            console.log(`[Gemini Advisor] Succeeded with model: ${model}`);
            break;
          }
        } catch (err) {
          const errMsg = err?.message || String(err);
          console.warn(`[Gemini Advisor] Model ${model} failed: ${errMsg}`);
          lastError = err;
        }
      }
      if (generatedText) {
        return res.json({
          advice: generatedText,
          model: usedModel,
          success: true
        });
      }
      console.error("[Gemini Advisor] All candidate models failed:", lastError?.message || lastError);
      return res.status(503).json({
        success: false,
        advice: null,
        error: "AI service is temporarily experiencing high demand. Please retry.",
        fallback: true
      });
    } catch (err) {
      console.error("[Gemini Advisor Unhandled Error]:", err?.message || err);
      return res.status(500).json({
        success: false,
        advice: null,
        error: "An internal error occurred while generating advice.",
        fallback: true
      });
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", server: "Profit Calculator Pro API" });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true, host: "0.0.0.0", port: 3e3 },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Profit Calculator Pro Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
