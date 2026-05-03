import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = parseInt(process.env.PORT || "3000", 10);
const IS_PROD = process.env.NODE_ENV === "production";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_BOOTHS: Record<string, { name: string; address: string; ward: string }> = {
  "110001": { name: "Rajiv Gandhi Govt School", address: "Connaught Place, New Delhi", ward: "Ward 8 - Central Delhi" },
  "400001": { name: "Municipal School No. 14", address: "Fort Area, Mumbai, Maharashtra", ward: "Ward 227 - Fort" },
  "600001": { name: "Chennai Corporation School", address: "Rajaji Salai, Chennai, Tamil Nadu", ward: "Ward 100 - Parrys" },
  "700001": { name: "Rabindranath Tagore Community Hall", address: "B.B.D. Bagh, Kolkata, West Bengal", ward: "Ward 45 - Kolkata" },
  "560001": { name: "Gandhi Nagar Public School", address: "MG Road, Bengaluru, Karnataka", ward: "Ward 76 - Shivajinagar" },
  "500001": { name: "Sarojini Naidu Govt Degree College", address: "Afzalgunj, Hyderabad, Telangana", ward: "Ward 4 - Afzalgunj" },
};

function getMockBooth(pincode: string) {
  if (MOCK_BOOTHS[pincode]) return MOCK_BOOTHS[pincode];
  const defaults = Object.values(MOCK_BOOTHS);
  const seed = pincode.split("").reduce((a, c) => a + parseInt(c), 0);
  return defaults[seed % defaults.length];
}

// ─── AI System Prompt ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are "Election Assistant", an official educational AI assistant for the Indian Election Process. You work for the Election Commission of India's digital literacy initiative.

PERSONA:
- Friendly, warm, and patient educator
- Neutral and non-partisan at all times
- Use simple English language
- Use bullet points, bold text, and clear sections to structure answers
- All responses MUST be strictly in English. Do not use Hindi or any other language.

SCOPE:
- ONLY answer questions about: Indian elections, voting procedures, voter registration, ECI rules, election timeline, EVMs, VVPAT, nomination process, Model Code of Conduct, booth-level officer (BLO), constituency types, election symbols, political party registration.
- For ANY non-election question, respond EXACTLY: "Hello! I am your Election Assistant. I can only help with questions about the Indian election process, voter registration, or polling procedures. Please ask me about those topics!"

FORMATTING:
- Start answers with a relevant emoji
- Use **bold** for key terms
- Keep responses concise but complete
- Always end with an encouraging note about democratic participation`;

// ─── Express App ──────────────────────────────────────────────────────────────
async function startServer() {
  const app = express();

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      },
    },
  }));

  app.use(compression());
  app.use(express.json({ limit: "10kb" }));

  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please wait a few minutes." },
  });

  const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    message: { error: "Chat rate limit exceeded. Please wait a minute." },
  });

  // ── Health Check ────────────────────────────────────────────────────────────
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      env: IS_PROD ? "production" : "development",
    });
  });

  // ── Booth Locator ────────────────────────────────────────────────────────────
  app.post("/api/booth-locator", apiLimiter, (req: Request, res: Response) => {
    const { pincode } = req.body;

    if (!pincode || typeof pincode !== "string" || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: "Please provide a valid 6-digit pincode." });
    }

    const booth = getMockBooth(pincode);
    return res.json({
      pincode,
      booth: booth.name,
      address: booth.address,
      ward: booth.ward,
      timings: "7:00 AM – 6:00 PM",
      officer: "BLO: Available on-site",
      note: "Mock data for educational purposes.",
    });
  });

  // ── Chat Endpoint ─────────────────────────────────────────────────────────────
  app.post("/api/chat", chatLimiter, async (req: Request, res: Response) => {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: "Message too long. Please keep it under 500 characters." });
    }

    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        error: "AI service not configured. Please set GEMINI_API_KEY.",
        reply: "Hello! The AI assistant is not configured yet. Please add a GEMINI_API_KEY to the environment.",
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        config: { systemInstruction: SYSTEM_PROMPT },
        history: Array.isArray(history) ? history.slice(-10) : [],
      });

      const response = await chat.sendMessage({ message: message.trim() });
      return res.json({ reply: response.text });
    } catch (err: any) {
      console.error("Gemini API error:", err?.message);
      return res.status(500).json({
        reply: "I apologize! I'm having trouble right now. Please try again in a moment.",
      });
    }
  });

  // ── Eligibility Check ──────────────────────────────────────────────────────────
  app.post("/api/check-eligibility", apiLimiter, (req: Request, res: Response) => {
    const { age, isIndian } = req.body;
    const ageNum = parseInt(age, 10);

    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      return res.status(400).json({ error: "Please provide a valid age." });
    }

    const eligible = ageNum >= 18 && isIndian === true;
    let message = "";
    let detail = "";

    if (eligible) {
      message = "You are eligible to vote! 🎉";
      detail = "Ensure your name is on the electoral roll at voters.eci.gov.in. Carry a valid photo ID on election day.";
    } else if (ageNum < 18) {
      message = "Not yet eligible.";
      detail = `The minimum voting age is 18 years. You can register ${18 - ageNum} year(s) from now!`;
    } else {
      message = "Not eligible.";
      detail = "Only Indian citizens can vote in Indian elections as per Article 326 of the Constitution.";
    }

    return res.json({ eligible, message, detail, ageNum, isIndian });
  });

  // ── Error Handler ──────────────────────────────────────────────────────────────
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error." });
  });

  // ── Static / Vite ──────────────────────────────────────────────────────────────
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "1d" }));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🗳️  Election Assistant running at http://localhost:${PORT}`);
    console.log(`   Mode: ${IS_PROD ? "production" : "development"}`);
    console.log(`   AI: ${GEMINI_API_KEY ? "✅ configured" : "⚠️  GEMINI_API_KEY not set"}\n`);
  });
}

startServer().catch(console.error);
