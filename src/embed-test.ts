import Test from './components/Test/Test.svelte';

const embedEl = document.getElementById('embed') as HTMLDivElement;

new Test({
  target: embedEl,
  props: { ...embedEl.dataset }
});
