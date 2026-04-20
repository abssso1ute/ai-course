import cron from "node-cron";
import { checkEndpoint } from "./probe.js";
import { analyzeResult, dispatchAction } from "./analyzer.js";
import { analyzeWithAI } from "./aiAnalyzer.js";
import { logger } from "./logger.js";

const TARGET_URL = "https://jsonplaceholder.typicode.com/posts/1";

let consecutiveFailures = 0;

const config = {
  expectedStatus: 200,
  maxResponseTime: 2000
};

async function runCheck() {
  logger.info(`Starting check for ${TARGET_URL}`);

  const probeResult = await checkEndpoint(TARGET_URL);

  // если статус 200, но ответ слишком медленный — включаем AI анализ
  if (probeResult.success && probeResult.responseTime > config.maxResponseTime) {
    logger.warn("Suspicious response detected. Running AI Analyzer...");

    const aiAnalysis = await analyzeWithAI(probeResult);

    logger.warn(
      `AI Analysis: health=${aiAnalysis.health}, confidence=${aiAnalysis.confidence}, reason=${aiAnalysis.reason}`
    );

    if (aiAnalysis.health === "unhealthy") {
      console.error("ALERT:", aiAnalysis.reason);
    }

    logger.info("Check finished (AI analyzed).");
    return;
  }

  const analysis = analyzeResult(probeResult, config);
  const actionResult = dispatchAction(analysis, consecutiveFailures);

  consecutiveFailures = actionResult.newFailuresCount;

  logger.info(
    `Result: ${analysis.outcome} | ${analysis.message} | failures=${consecutiveFailures}`
  );

  logger.info(`Check finished for ${TARGET_URL}`);
}

// запуск сразу
runCheck();

// каждые 5 минут
cron.schedule("*/5 * * * *", async () => {
  await runCheck();
});

logger.info("API Monitor Agent started. Cron schedule: every 5 minutes.");