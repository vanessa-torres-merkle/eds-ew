// 'extend': runs AFTER the hub decorate(), so it only adds to the hub result
export default function decorate(block) {
  block.querySelector('h1')?.classList.add('spoke-a-title');
}
