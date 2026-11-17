/**
 * Shared accordion decorator. Rows alternate: odd rows are titles, even rows are content.
 * @param {Element} block The accordion block
 */
export default function decorateAccordion(block) {
  const titles = block.querySelectorAll(':scope > div:nth-child(odd)');
  titles.forEach((title) => {
    title.classList.add('item-title');

    // Drop the trailing cell only when authors left it empty
    const cells = title.querySelectorAll(':scope > div');
    const last = cells[cells.length - 1];
    if (cells.length > 1 && !last.textContent.trim() && !last.querySelector('picture, img')) {
      last.remove();
    }

    const content = title.nextElementSibling;
    if (content) content.classList.add('item-content');

    title.addEventListener('click', () => {
      title.classList.toggle('open');
    });
  });
}
