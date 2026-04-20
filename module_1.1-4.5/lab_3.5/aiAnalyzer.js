export async function analyzeWithAI(probeResult) {
  const bodyPreview = probeResult.data
    ? JSON.stringify(probeResult.data).slice(0, 500)
    : "No body";

  const prompt = `
Ты — DevOps-инженер. Проанализируй данные проверки API.

Данные:
- statusCode: ${probeResult.statusCode}
- responseTime: ${probeResult.responseTime} ms
- bodyPreview: ${bodyPreview}

Ответь строго JSON в формате:
{ "health": "healthy" | "degraded" | "unhealthy", "confidence": число от 0 до 1, "reason": "краткое объяснение" }
`;

  // MOCK (вместо настоящего OpenAI API)
  // сюда позже можно подключить fetch к OpenAI / Ollama
  if (probeResult.responseTime > 2000) {
    return {
      health: "degraded",
      confidence: 0.8,
      reason: "API отвечает слишком медленно, возможна перегрузка сервера"
    };
  }

  if (probeResult.data && probeResult.data.status === "degraded") {
    return {
      health: "degraded",
      confidence: 0.9,
      reason: "В теле ответа API статус degraded"
    };
  }

  return {
    health: "healthy",
    confidence: 0.95,
    reason: "Статус-код нормальный, время ответа в пределах нормы"
  };
}