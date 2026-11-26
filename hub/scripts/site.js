// The EDS site name of the hub. Change it here if the hub site is renamed.
export const HUB_SITE = 'eds-ew';
// EDS site names of the spokes. Add a new spoke here (and under /spokes/<name>).
export const SPOKES = ['spoke-a', 'spoke-b', 'pon', 'oxagon'];

const DEFAULTS = {
  defaultLocale: 'en',
  locales: [],
  hosts: [],
  theme: {},
};

let config = { ...DEFAULTS };
let locale = {
  prefix: '', code: 'en', lang: 'en', region: '',
};

export const getSiteConfig = () => config;
export const getLocale = () => locale;

/* ---------- config ---------- */

export async function loadConfig() {
  try {
    const resp = await fetch('/config.json');
    if (!resp.ok) return;
    const json = await resp.json();
    // Check the shape of your /config.json and adjust this line if needed
    const custom = json.public?.custom ?? json.custom ?? json;
    config = { ...DEFAULTS, ...custom };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('No site config, using defaults', e);
  }
}

/* ---------- brand ---------- */

/**
 * Environment detection: localhost vs. EDS (aem.page / aem.live / aem.network).
 */
export function isLocalhost() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

/**
 * Site name from an EDS hostname: {ref}--{site}--{org}.aem.(page|live)
 */
function getSiteFromHostname(hostname = window.location.hostname) {
  const [, site] = hostname.split('.')[0].split('--');
  return site || '';
}

/**
 * Maps a site/brand name to 'hub' or a known spoke; anything else falls back to the hub.
 */
function toBrand(name) {
  const value = (name || '').toLowerCase();
  if (!value || value === 'hub' || value === HUB_SITE) return 'hub';
  if (SPOKES.includes(value)) return value;
  // eslint-disable-next-line no-console
  console.warn(`Unknown site/brand "${name}", using hub. Known spokes: ${SPOKES.join(', ')}`);
  return 'hub';
}

/**
 * localhost: ?brand= (remembered per tab). EDS: derived from the domain.
 */
function resolveBrand() {
  if (isLocalhost()) {
    let name = 'hub';
    try {
      const q = new URLSearchParams(window.location.search).get('brand');
      if (q && /^[a-z0-9-]+$/i.test(q)) sessionStorage.setItem('dev-brand', q);
      name = sessionStorage.getItem('dev-brand') || name;
    } catch (e) { /* storage blocked: fall through */ }
    return toBrand(name);
  }
  return toBrand(getSiteFromHostname());
}

/* ---------- locale ---------- */

const LOCALE_RE = /^[a-z]{2}(-[a-z]{2})?$/i;

export function isLocaleSegment(seg) {
  if (!seg) return false;
  const { locales } = config;
  return locales.length ? locales.includes(seg.toLowerCase()) : LOCALE_RE.test(seg);
}

function resolveLocale(pathname) {
  const seg = pathname.split('/')[1] || '';
  if (isLocaleSegment(seg)) {
    const code = seg.toLowerCase();
    const [lang, region = ''] = code.split('-');
    return {
      prefix: `/${code}`, code, lang, region,
    };
  }
  const [lang, region = ''] = config.defaultLocale.split('-');
  return {
    prefix: '', code: config.defaultLocale, lang, region,
  };
}

/* ---------- theme ---------- */

export function applyTheme() {
  const { theme } = config;
  Object.entries(theme || {}).forEach(([prop, value]) => {
    if (prop.startsWith('--')) document.documentElement.style.setProperty(prop, value);
  });
}

/* ---------- init ---------- */

export async function initSite() {
  await loadConfig();
  config.brand = resolveBrand();
  locale = resolveLocale(window.location.pathname);
  document.documentElement.lang = locale.region
    ? `${locale.lang}-${locale.region.toUpperCase()}`
    : locale.lang;
  document.documentElement.dataset.brand = config.brand;
  applyTheme();
}

/* ---------- link localization ---------- */

function isInternal(url) {
  const { hosts } = config;
  if (url.hostname === window.location.hostname) return true;
  if (hosts.includes(url.hostname)) return true;
  const [, site, org] = window.location.hostname.split('.')[0].split('--');
  const [, uSite, uOrg] = url.hostname.split('.')[0].split('--');
  return /\.aem\.(page|live)$/.test(url.hostname)
    && !!site && site === uSite && org === uOrg;
}

function shouldLocalize(pathname) {
  if (isLocaleSegment(pathname.split('/')[1])) return false;
  if (/\.(?!html$)[a-z0-9]{2,5}$/i.test(pathname)) return false;
  if (pathname.startsWith('/media_')) return false;
  return true;
}

export function decorateLinks(root) {
  const { prefix } = locale;
  root.querySelectorAll('a[href]').forEach((a) => {
    const raw = a.getAttribute('href');
    if (!raw || raw.startsWith('#') || /^(mailto|tel|javascript):/i.test(raw)) return;
    let url;
    try { url = new URL(raw, window.location.href); } catch { return; }

    if (url.hash === '#nolocal') {
      url.hash = '';
      a.href = isInternal(url) ? `${url.pathname}${url.search}` : url.href;
      return;
    }

    if (!prefix || !isInternal(url) || !shouldLocalize(url.pathname)) return;
    a.href = `${prefix}${url.pathname}${url.search}${url.hash}`;
  });
}
