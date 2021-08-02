import Test from './components/Test/Test.svelte';
import { initAppleNews } from './apple-news';

const COMPONENTS = {
  test: Test
};

function render(embedEl: HTMLElement) {
  const { component, ...props } = embedEl.dataset;
  const Component = component && COMPONENTS[component];

  if (Component) {
    if (embedEl.firstElementChild) {
      return;
    }

    new Component({
      target: embedEl,
      props
    });
  }
}

window.addEventListener('load', () => {
  const embedEl = document.getElementById('embed') as HTMLElement;

  if (window.applenews) {
    initAppleNews(embedEl, render);
  } else {
    render(embedEl);
  }
});
