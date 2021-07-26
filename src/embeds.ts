import Test from './components/Test/Test.svelte';

const COMPONENTS = {
  test: Test
};

const target = document.getElementById('embed');

if (target) {
  const { component, ...props } = target.dataset;
  const Component = component && COMPONENTS[component];

  if (Component) {
    new Component({
      target,
      props
    });
  }
}
