import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini API route for AI Profit Advisor
  app.post('/api/gemini/advisor', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('[Gemini Advisor] GEMINI_API_KEY environment variable is missing.');
        return res.status(503).json({
          error: 'Gemini API key is not configured on server',
          fallback: true,
          success: false,
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
        language,
      } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      let targetLangName = 'English';
      let langInstruction = 'Respond ONLY in English. Do not use Hindi or Marathi.';
      let bulletHeaders = {
        status: 'Profit Status',
        target: 'Sales Target',
        tip: 'Business Tip',
      };

      if (language === 'hi') {
        targetLangName = 'Hindi (हिन्दी)';
        langInstruction = 'CRITICAL LANGUAGE REQUIREMENT: You MUST respond 100% EXCLUSIVELY in Hindi (हिन्दी) using Devanagari script. Every sentence, explanation, and word of advice MUST be written in natural, fluent Hindi. DO NOT use English sentences or phrases under any circumstances.';
        bulletHeaders = {
          status: 'मुनाफ़ा स्थिति',
          target: 'बिक्री लक्ष्य',
          tip: 'व्यापारिक सलाह',
        };
      } else if (language === 'mr') {
        targetLangName = 'Marathi (मराठी)';
        langInstruction = 'CRITICAL LANGUAGE REQUIREMENT: You MUST respond 100% EXCLUSIVELY in Marathi (मराठी) using Devanagari script. Every sentence, explanation, and word of advice MUST be written in natural, fluent Marathi. DO NOT use English or Hindi sentences under any circumstances.';
        bulletHeaders = {
          status: 'नफा स्थिती',
          target: 'विक्री उद्दिष्ट',
          tip: 'व्यावसायिक सल्ला',
        };
      } else {
        targetLangName = 'English';
        langInstruction = 'CRITICAL LANGUAGE REQUIREMENT: You MUST respond 100% in clear, professional, practical English.';
        bulletHeaders = {
          status: 'Profit Status',
          target: 'Sales Target',
          tip: 'Business Advice',
        };
      }

      const profitPerPiece = Number(sellingPrice) - Number(costPrice);
      const isProfit = profitPerPiece > 0;
      const isLoss = profitPerPiece < 0;

      const prompt = `You are an expert, practical business advisor for small shopkeepers, traders, and entrepreneurs.

${langInstruction}

Here is the exact financial data for the product:
- Product Name: ${productName || 'Product'} (Preserve product name)
- Cost Price per unit: ₹${costPrice}
- Selling Price per unit: ₹${sellingPrice}
- Quantity: ${quantity} units
- Total Sales Revenue: ₹${totalSales}
- Total Cost: ₹${totalCost}
- Total ${isProfit ? 'Profit' : isLoss ? 'Loss' : 'Break-Even'}: ₹${totalProfit}
- Profit per unit: ₹${profitPerPiece}
- Return on Investment (ROI): ${profitPercentage}%
- Profit Margin on Sales: ${profitMarginOnSales}%

TASK:
Provide short, practical, and highly actionable business advice in ${targetLangName}.
Use exactly 3 clean bullet points formatted as follows:
• **${bulletHeaders.status}**: 1 clear sentence summarizing the current profit/loss condition (₹${profitPerPiece} per piece and ₹${totalProfit} total on ${quantity} pieces).
• **${bulletHeaders.target}**: 1 motivating, specific sentence with a sales volume target (e.g. how many units needed to achieve double profit or reach ₹2,000 / ₹5,000 profit).
• **${bulletHeaders.tip}**: 1 realistic tip on pricing, inventory rotation, batch purchasing, or reducing costs.

STRICT RULES:
1. ${langInstruction}
2. Keep the advice concise and easy to understand for a local business owner.
3. Format all currency amounts with the ₹ symbol cleanly (never write duplicate symbols like ₹₹).
4. Do not invent any outside numbers.`;

      const candidateModels = [
        'gemini-3.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-flash-lite-latest',
        'gemini-3.6-flash',
        'gemini-3.7-flash',
        'gemini-flash-latest',
        'gemini-pro-latest',
      ];
      let generatedText: string | null = null;
      let usedModel: string = '';
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          console.log(`[Gemini Advisor] Requesting model: ${model}`);
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
          });

          if (response && response.text) {
            generatedText = response.text;
            usedModel = model;
            console.log(`[Gemini Advisor] Succeeded with model: ${model}`);
            break;
          }
        } catch (err: any) {
          const errMsg = err?.message || String(err);
          console.warn(`[Gemini Advisor] Model ${model} failed: ${errMsg}`);
          lastError = err;
          // Continue to next candidate model in fallback chain
        }
      }

      if (generatedText) {
        return res.json({
          advice: generatedText,
          model: usedModel,
          success: true,
        });
      }

      // If all models in the chain failed
      console.error('[Gemini Advisor] All candidate models failed:', lastError?.message || lastError);
      return res.status(503).json({
        success: false,
        advice: null,
        error: 'AI service is temporarily experiencing high demand. Please retry.',
        fallback: true,
      });
    } catch (err: any) {
      console.error('[Gemini Advisor Unhandled Error]:', err?.message || err);
      return res.status(500).json({
        success: false,
        advice: null,
        error: 'An internal error occurred while generating advice.',
        fallback: true,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'Profit Calculator Pro API' });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Profit Calculator Pro Server running on port ${PORT}`);
  });
}

startServer();
