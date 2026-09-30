import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const hasKeys = Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);

export function getTurnstileConfig() {
  return {
    required: env.NODE_ENV === "production" || hasKeys,
    siteKey: env.TURNSTILE_SITE_KEY || ""
  };
}

export async function verifyTurnstile(token, { remoteIp, expectedAction, expectedHostname } = {}) {
  if (!hasKeys) {
    if (env.NODE_ENV !== "production") return;
    throw new HttpError(503, "Human verification is not configured. Please contact the site administrator.");
  }
  if (!token) throw new HttpError(400, "Complete the human verification check and try again.");

  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  let result;
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error("Turnstile verification request failed.");
    result = await response.json();
  } catch {
    throw new HttpError(503, "Human verification is temporarily unavailable. Please try again.");
  }

  if (!result.success || (expectedAction && result.action !== expectedAction) || (expectedHostname && result.hostname !== expectedHostname)) {
    throw new HttpError(400, "Human verification failed or expired. Please complete it again.");
  }
}
