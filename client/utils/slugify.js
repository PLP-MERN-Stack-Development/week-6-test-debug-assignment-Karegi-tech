// client/utils/slugify.js

function sanitizeSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')       // remove non-word characters
    .replace(/[\s_-]+/g, '-')       // replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');       // remove leading/trailing hyphens
}

module.exports = { sanitizeSlug };
