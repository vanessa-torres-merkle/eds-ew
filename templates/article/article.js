export default function decorate(main) {
  const h1 = main.querySelector('h1');
  if (h1) h1.insertAdjacentHTML('afterend', '<p class="byline">By the editorial team</p>');
}
