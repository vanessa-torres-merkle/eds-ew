export default function decorate(main) {
  // add to what the hub template produced
  main.querySelector('.article-header')?.classList.add('spoke-a-header');
}
