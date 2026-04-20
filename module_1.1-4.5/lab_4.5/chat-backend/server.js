import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const SYSTEM_PROMPT =
  "Ты — полезный ассистент в интерфейсе образовательной платформы 'CodeHub'. Отвечай кратко и по делу.";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "256kb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 12000) }));
}

function sendSse(res, obj) {
  res.write(`data: ${JSON.stringify(obj)}\n\n`);
}

app.post("/api/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...sanitizeHistory(history),
    { role: "user", content: message.trim() },
  ];

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  if (typeof res.flushHeaders === "function") res.flushHeaders();

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content ?? "";
      if (content) sendSse(res, { content });
    }

    sendSse(res, { done: true });
    res.end();
  } catch (error) {
    console.error(error);
    if (res.headersSent) {
      sendSse(res, { error: error.message || "stream error" });
      res.end();
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Chat proxy: http://localhost:${PORT}`);
});
