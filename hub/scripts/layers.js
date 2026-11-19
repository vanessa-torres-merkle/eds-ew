// Templates that exist in the hub. Add a name here when you create hub/templates/<name>/.
const HUB_TEMPLATES = ['article', 'landing'];

const state = { brand: 'hub', spokeBase: null, blocks: {}, templates: {}, hooks: {} };

export async function initLayers(brand) {
  window.hlx.resolveBlock = resolveBlock;
  if (!brand || brand === 'hub') return state;
  try {
    const mod = await import(`/spokes/${brand}/spoke.js`);
    Object.assign(state, {
      brand,
      spokeBase: `/spokes/${brand}`,
      blocks: mod.blocks || {},
      templates: mod.templates || {},
      hooks: mod.hooks || {},
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`No spoke layer for "${brand}", using hub only`, e);
  }
  return state;
}

// Returns the CSS and JS files to load, in order.
export function resolveBlock(name) {
  const hub = `/hub/blocks/${name}/${name}`;
  const spoke = state.spokeBase && `${state.spokeBase}/blocks/${name}/${name}`;
  const mode = state.spokeBase ? state.blocks[name] : undefined;

  if (mode === 'replace') return { css: [`${spoke}.css`], js: [`${spoke}.js`] };
  if (mode === 'extend') {
    return { css: [`${hub}.css`, `${spoke}.css`], js: [`${hub}.js`, `${spoke}.js`] };
  }
  return { css: [`${hub}.css`], js: [`${hub}.js`] };
}

/**
 * Returns the CSS/JS to load for a template, or null if the template is unknown.
 * - in the hub list, no spoke entry -> hub only
 * - spoke 'extend'  -> hub first, then spoke
 * - spoke 'replace' -> spoke only (also use this for spoke-only templates)
 */
export function resolveTemplate(name) {
  if (!name || !/^[a-z0-9-]+$/.test(name)) return null;
  const hub = `/hub/templates/${name}/${name}`;
  const spoke = state.spokeBase && `${state.spokeBase}/templates/${name}/${name}`;
  const mode = state.spokeBase ? state.templates[name] : undefined;

  if (mode === 'replace') return { css: [`${spoke}.css`], js: [`${spoke}.js`] };
  if (mode === 'extend' && HUB_TEMPLATES.includes(name)) {
    return { css: [`${hub}.css`, `${spoke}.css`], js: [`${hub}.js`, `${spoke}.js`] };
  }
  if (HUB_TEMPLATES.includes(name)) return { css: [`${hub}.css`], js: [`${hub}.js`] };
  return null;
}

export async function runHook(name, ...args) {
  if (state.hooks[name]) await state.hooks[name](...args);
}

export async function loadSpokeStyles() {
  if (!state.spokeBase) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await loadCSS(`${state.spokeBase}/styles/theme.css`);
}
