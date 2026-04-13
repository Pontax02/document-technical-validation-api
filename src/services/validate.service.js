// validate.service.js — Core validation logic
// Contains the business rules for document validation.
// Each function follows the same pattern:
//   1. Collect validation errors into an array
//   2. Run MIME and size checks (always)
//   3. Delegate to image or PDF validators based on MIME type
//   4. Compute SHA-256 hash
//   5. Delete the temporary file in the finally block (always runs, even on error)
//   6. Return a structured { valid, errors, metadata } object

import fs from 'fs';
import { env } from '../config/env.js';
import { isMimeAllowed } from '../utils/mime.utils.js';
import { getFileHash } from '../utils/hash.utils.js';
import { validateImage } from '../utils/image.utils.js';
import { validatePdf } from '../utils/pdf.utils.js';


// validateFirstDocument — validates the required primary file (file_1)
export const validateFirstDocument = async (file_1) => {
  const errors = [];
  let imageMetadata = null;
  let hash = null;

  try {
    // Check 1: MIME type must be jpeg, png, or pdf
    if (!isMimeAllowed(file_1.mimetype)) {
      errors.push("mime_not_allowed");
    }

    // Check 2: File must be larger than the configured minimum size
    if (file_1.size < env.MIN_FILE_SIZE_KB * 1024) {
      errors.push("file_too_small");
    }

    // Check 3: Type-specific validation
    if (file_1.mimetype.startsWith("image/")) {
      // Images: resolution, blank/black detection, corruption check
      const result = await validateImage(file_1.path, env.MIN_RESOLUTION_PX);
      errors.push(...result.errors);
      imageMetadata = result.metadata;
    } else if (file_1.mimetype === "application/pdf") {
      // PDFs: magic-bytes check, page count, corruption check
      const result = await validatePdf(file_1.path);
      errors.push(...result.errors);
      imageMetadata = result.metadata;
    }

    // Compute SHA-256 hash of the raw file bytes for integrity / deduplication
    hash = getFileHash(file_1.path);

  } finally {
    // Always delete the temporary file from disk, even if validation throws
    if (fs.existsSync(file_1.path)) fs.unlinkSync(file_1.path);
  }

  return {
    valid: errors.length === 0,   // true only when the errors array is empty
    errors,
    metadata: {
      mime: file_1.mimetype,
      sizeKB: Math.round(file_1.size / 1024),
      hash,
      ...imageMetadata,            // spreads width/height/format (images) or pages/pdfVersion (PDFs)
    },
  };
};


// validateSecondDocument — validates the optional secondary file (file_2)
// Logic is identical to validateFirstDocument; kept separate so each file's
// result is independently tracked and could diverge in future versions.
export const validateSecondDocument = async (file_2) => {
  const errors = [];
  let imageMetadata = null;
  let hash = null;

  try {
    if (!isMimeAllowed(file_2.mimetype)) {
      errors.push("mime_not_allowed");
    }

    if (file_2.size < env.MIN_FILE_SIZE_KB * 1024) {
      errors.push("file_too_small");
    }

    if (file_2.mimetype.startsWith("image/")) {
      const result = await validateImage(file_2.path, env.MIN_RESOLUTION_PX);
      errors.push(...result.errors);
      imageMetadata = result.metadata;
    } else if (file_2.mimetype === "application/pdf") {
      const result = await validatePdf(file_2.path);
      errors.push(...result.errors);
      imageMetadata = result.metadata;
    }

    hash = getFileHash(file_2.path);

  } finally {
    if (fs.existsSync(file_2.path)) fs.unlinkSync(file_2.path);
  }

  return {
    valid: errors.length === 0,
    errors,
    metadata: {
      mime: file_2.mimetype,
      sizeKB: Math.round(file_2.size / 1024),
      hash,
      ...imageMetadata,
    },
  };
};
