export const blocks = {
  hero: 'extend',            // hub hero runs first, then spokes/spoke-a/blocks/hero/hero.js
  accordion: 'replace',          // spokes/spoke-a/blocks/accordion fully replaces the hub block
  'swiss-banner': 'replace', // new block that only exists in this spoke
};

export const templates = {
  article: 'extend',     // hub article runs first, then spokes/spoke-a/templates/article
  campaign: 'replace',   // spoke-only template
};

export const hooks = {
  async loadLazy() {
    // e.g. load a CH-specific consent or analytics script
  },
};
