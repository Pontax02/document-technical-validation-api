// cors.js — CORS policy configuration
// Uses the 'cors' package to restrict cross-origin access.
// Only origins listed in env.ALLOWED_ORIGINS are permitted.

import cors from "cors";
import { env } from "./env.js";

export const corsOptions = cors({
  // Whitelist of allowed origins (read from .env)
  origin: env.ALLOWED_ORIGINS,

  // Only GET and POST methods are needed for this API
  methods: ['GET', 'POST'],

  // Allow standard content type and auth headers
  allowedHeaders: ['Content-Type', 'Authorization'],
});
