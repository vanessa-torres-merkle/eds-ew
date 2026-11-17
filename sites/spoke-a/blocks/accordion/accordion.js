/**
 * SpokeA accordion extension. Runs after the shared decorator (mode: 'extend').
 * @param {Element} block The accordion block
 */
export default function decorate(block) {
  block.classList.add('spoke-a');
}
