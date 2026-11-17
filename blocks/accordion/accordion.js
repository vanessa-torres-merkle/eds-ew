import decorateAccordion from '../../scripts/accordion.js';
import decorateWithExtension from '../../scripts/block-extensions.js';

export default async function decorate(block) {
  await decorateWithExtension(block, 'accordion', decorateAccordion);
}
