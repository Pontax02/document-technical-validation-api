// logger.js — Application-wide logger built with Winston
// Two output channels:
//   - Console: colourised, human-friendly format for development
//   - Files:   plain text, machine-readable format for production/audit
//     · logs/app.log   → all log levels
//     · logs/error.log → only 'error' level entries

import winston from 'winston';
import { env } from './env.js';

const { combine, timestamp, printf, colorize } = winston.format;

// Console format: adds colour and a human-readable timestamp
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`)
);

// File format: same structure but without colour escape codes
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
);

export const logger = winston.createLogger({
  // In production only log warnings and errors to reduce noise
  level: env.NODE_ENV === 'production' ? 'warn' : 'info',

  transports: [
    // Always log to the console
    new winston.transports.Console({ format: consoleFormat }),

    // Write every log entry to app.log
    new winston.transports.File({ filename: 'logs/app.log', format: fileFormat }),

    // Write only errors to a dedicated error.log for quick incident triage
    new winston.transports.File({ filename: 'logs/error.log', format: fileFormat, level: 'error' }),
  ],
});
