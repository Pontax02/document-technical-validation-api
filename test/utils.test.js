import { describe, it, expect } from '@jest/globals';
import { isMimeAllowed } from '../src/utils/mime.utils.js';
import { getFileHash } from '../src/utils/hash.utils.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => path.join(__dirname, 'fixtures', name);

// ─── mime.utils ───────────────────────────────────────────────────────────────

describe('isMimeAllowed', () => {
  it('allows image/jpeg', () => expect(isMimeAllowed('image/jpeg')).toBe(true));
  it('allows image/png', () => expect(isMimeAllowed('image/png')).toBe(true));
  it('allows application/pdf', () => expect(isMimeAllowed('application/pdf')).toBe(true));
  it('rejects image/gif', () => expect(isMimeAllowed('image/gif')).toBe(false));
  it('rejects text/plain', () => expect(isMimeAllowed('text/plain')).toBe(false));
});

// ─── hash.utils ───────────────────────────────────────────────────────────────

describe('getFileHash', () => {
  it('returns a 64-char SHA-256 hex string', () => {
    const hash = getFileHash(fixture('valid.jpg'));
    expect(typeof hash).toBe('string');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it('same file always returns the same hash', () => {
    const h1 = getFileHash(fixture('valid.jpg'));
    const h2 = getFileHash(fixture('valid.jpg'));
    expect(h1).toBe(h2);
  });

  it('different files return different hashes', () => {
    const h1 = getFileHash(fixture('valid.jpg'));
    const h2 = getFileHash(fixture('low_res.jpg'));
    expect(h1).not.toBe(h2);
  });
});
