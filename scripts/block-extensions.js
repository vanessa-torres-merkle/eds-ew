import { getMetadata, loadCSS } from './aem.js';

/*
 * Code-owned registry of site-local block extensions: registry[site][block].
 * - mode 'extend': shared decorator runs first, then the site decorator.
 * - mode 'replace': only the site decorator runs, on the original markup.
 * - js / css are optional and loaded only when the block is used.
 * Shared block CSS is always loaded by the standard loader; site CSS is added after it.
 */
const registry = {
  'spoke-a': {
    accordion: {
      mode: 'extend',
      js: () => import('../sites/spoke-a/blocks/accordion/accordion.js'),
      css: '/sites/spoke-a/blocks/accordion/accordion.css',
    },
  },
};

/**
 * Decorates a block applying the extension registered for the current site, if any.
 * @param {Element} block The block element
 * @param {string} blockName The block name
 * @param {Function} sharedDecorate The shared decorator
 */
export default async function decorateWithExtension(block, blockName, sharedDecorate) {
  const extension = registry[getMetadata('site')]?.[blockName];
  if (!extension) {
    await sharedDecorate(block);
    return;
  }

  try {
    const [mod] = await Promise.all([
      extension.js ? extension.js() : undefined,
      extension.css ? loadCSS(`${window.hlx.codeBasePath}${extension.css}`) : undefined,
    ]);
    if (extension.mode !== 'replace') await sharedDecorate(block);
    if (mod?.default) await mod.default(block);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`failed to apply site extension for ${blockName}`, error);
  }
}
