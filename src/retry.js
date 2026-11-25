import { UpstreamError } from './errors.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Call fn with retries for transient failures only (network errors and 5xx), with exponential backoff.
// Client errors (4xx) are permanent: retrying them only adds load.
export async function withRetry(fn, { attempts = 3, baseDelayMs = 50 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      const transient = !(error instanceof UpstreamError) || error.status >= 400;
      if (!transient || attempt === attempts) break;
      sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }
  throw lastError;
}
