// slugify.test.js - Unit test for sanitizeSlug utility

const { sanitizeSlug } = require('../../../utils/slugify');

describe('sanitizeSlug utility function', () => {
  it('converts text to lowercase and trims whitespace', () => {
    expect(sanitizeSlug('  Hello World  ')).toBe('hello-world');
  });

  it('removes special characters and replaces spaces with hyphens', () => {
    expect(sanitizeSlug('React! Rocks? JS')).toBe('react-rocks-js');
  });

  it('handles multiple spaces and underscores properly', () => {
    expect(sanitizeSlug('This__is    a_test')).toBe('this-is-a-test');
  });

  it('removes leading/trailing hyphens', () => {
    expect(sanitizeSlug('--Sluggy Slug--')).toBe('sluggy-slug');
  });

  it('returns an empty string if input is only symbols', () => {
    expect(sanitizeSlug('!!!')).toBe('');
  });

  it('handles numeric input correctly', () => {
    expect(sanitizeSlug('  Version 2.0.1 ')).toBe('version-201');
  });

  it('handles mixed casing and special chars', () => {
    expect(sanitizeSlug('HeLLo--WORLD!!__Test')).toBe('hello-world-test');
  });
});
