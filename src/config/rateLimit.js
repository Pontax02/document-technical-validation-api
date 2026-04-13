// rateLimit.js — Request rate limiter configuration
// Uses 'express-rate-limit' to prevent abuse / brute-force attacks.
// Limits each IP to env.RATE_LIMIT_MAX requests within env.RATE_LIMIT_WINDOW_MS.

import rateLimit from "express-rate-limit";
import { env } from "./env.js";

export const rateLimitOptions = rateLimit({
  // Time window for the limit (default: 15 minutes)
  windowMs: env.RATE_LIMIT_WINDOW_MS,

  // Maximum requests per IP within the window (default: 100)
  max: env.RATE_LIMIT_MAX,

  // Send standard RateLimit-* headers in responses (RFC-compliant)
  standardHeaders: true,

  // Disable the deprecated X-RateLimit-* headers
  legacyHeaders: false,
});
