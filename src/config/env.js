// env.js — Centralised environment configuration
// Loads variables from the .env file (via dotenv) and exports them
// as a single typed object so the rest of the app never reads
// process.env directly — this makes configuration easy to audit and test.

import 'dotenv/config';

export const env = {
  // HTTP port the server will listen on (default: 3000)
  PORT: process.env.PORT || 3000,

  // Execution environment: 'development' | 'production' | 'test'
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Comma-separated list of origins allowed by CORS.
  // e.g. "http://localhost:3000,https://myapp.com"
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'],

  // Rate limiter time window in milliseconds (default: 900 000 ms = 15 min)
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900_000,

  // Maximum number of requests allowed per client within the window (default: 100)
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,

  // Maximum accepted file size in megabytes (default: 5 MB)
  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB) || 5,

  // Minimum accepted file size in kilobytes (default: 30 KB)
  // Files smaller than this are considered too low quality to validate
  MIN_FILE_SIZE_KB: Number(process.env.MIN_FILE_SIZE_KB) || 30,

  // Minimum image dimension (width AND height) in pixels (default: 600 px)
  MIN_RESOLUTION_PX: Number(process.env.MIN_RESOLUTION_PX) || 600,

  // Directory where multer temporarily stores uploaded files (default: 'uploads')
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',

  // Secret key required to access admin endpoints (always override in production!)
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || 'changeme',
};
