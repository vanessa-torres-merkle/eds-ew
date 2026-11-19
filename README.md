# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--eds-ew--vanessa-torres-merkle.aem.page/
- Live: https://main--eds-ew--vanessa-torres-merkle.aem.live/

## Documentation

Before using the aem-boilerplate, we recommend you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Site-local block extensions

A site can extend a shared block without changing what authors insert (e.g. `Accordion`).

1. Set page metadata `site` (e.g. `spoke-a`) on every page of that site.
1. Add the extension under `sites/<site>/blocks/<block>/<block>.js` and `.css`. The JS default export receives the block element.
1. Register it in `scripts_old` (`registry[site][block]` with `mode`, `js`, `css`; `js` and `css` are optional).
1. The shared block's entry point (`blocks_old`) calls `decorateWithExtension(block, name, sharedDecorate)`. Shared logic lives in `scripts_old`.

Behavior:
- CSS: shared `blocks_old` loads first, then the site CSS, so site rules override on equal specificity. Scope them to the block class.
- `mode: 'extend'`: shared decorator runs, then the site decorator on the already-decorated block.
- `mode: 'replace'`: only the site decorator runs, on the original markup (shared CSS still loads).
- Sites without a registration get the shared behavior. Registered assets that fail to load are logged to the console.

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `eds-ew` directory in your favorite IDE and start coding :)
