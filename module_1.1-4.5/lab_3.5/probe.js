import axios from "axios";

export async function checkEndpoint(url) {
  const start = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 10000
    });

    const responseTime = Date.now() - start;

    return {
      success: true,
      statusCode: response.status,
      responseTime,
      error: null,
      data: response.data
    };
  } catch (err) {
    const responseTime = Date.now() - start;

    let statusCode = null;
    let errorMessage = "Unknown error";

    if (err.response) {
      statusCode = err.response.status;
      errorMessage = `Request failed with status ${statusCode}`;
    } else if (err.code === "ECONNABORTED") {
      errorMessage = "Timeout error (request took too long)";
    } else if (err.message) {
      errorMessage = err.message;
    }

    return {
      success: false,
      statusCode,
      responseTime,
      error: errorMessage,
      data: null
    };
  }
}