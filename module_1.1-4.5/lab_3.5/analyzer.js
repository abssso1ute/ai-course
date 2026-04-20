export function analyzeResult(probeResult, config = {}) {
  const expectedStatus = config.expectedStatus ?? 200;
  const maxResponseTime = config.maxResponseTime ?? 1000;

  if (!probeResult.success) {
    if (probeResult.error && probeResult.error.toLowerCase().includes("timeout")) {
      return {
        outcome: "FAILED_TIMEOUT",
        message: `Timeout while requesting endpoint (${probeResult.responseTime}ms)`
      };
    }

    return {
      outcome: "ERROR",
      message: probeResult.error || "Unknown request error"
    };
  }

  if (probeResult.statusCode !== expectedStatus) {
    return {
      outcome: "FAILED_STATUS",
      message: `Unexpected status code: ${probeResult.statusCode} (expected ${expectedStatus})`
    };
  }

  if (probeResult.responseTime > maxResponseTime) {
    return {
      outcome: "FAILED_TIMEOUT",
      message: `Response too slow: ${probeResult.responseTime}ms (max ${maxResponseTime}ms)`
    };
  }

  return {
    outcome: "SUCCESS",
    message: `OK (${probeResult.responseTime}ms)`
  };
}

export function dispatchAction(analysis, consecutiveFailures = 0) {
  if (analysis.outcome === "SUCCESS") {
    return {
      newFailuresCount: 0,
      shouldAlert: false,
      message: analysis.message
    };
  }

  const newFailuresCount = consecutiveFailures + 1;

  if (newFailuresCount > 3) {
    sendAlert(analysis.message);

    return {
      newFailuresCount,
      shouldAlert: true,
      message: analysis.message
    };
  }

  return {
    newFailuresCount,
    shouldAlert: false,
    message: analysis.message
  };
}

export function sendAlert(message) {
  console.error("ALERT:", message);
}