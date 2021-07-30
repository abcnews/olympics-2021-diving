import acto from '@abcnews/alternating-case-to-object';
import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import './global.css';
import Hero from './components/Hero/Hero.svelte';
import Scrubby from './components/Scrubby/Scrubby.svelte';
import Test from './components/Test/Test.svelte';

whenOdysseyLoaded.then(() => {
  selectMounts('hero').forEach(mountEl => {
    const { parentElement } = mountEl;

    if (!parentElement) {
      return;
    }

    const titleEl = parentElement.querySelector('h1');

    if (titleEl && titleEl.parentElement === parentElement) {
      mountEl.removeAttribute('class');
      parentElement.insertBefore(mountEl, titleEl);
    }

    new Hero({
      target: mountEl,
      props: {}
    });
  });

  selectMounts('scrubby').forEach(mountEl => {
    const blockEl = mountEl.closest('.Block');

    if (!blockEl) {
      return;
    }

    const rootEl = blockEl.querySelector('.Block-media');

    if (!rootEl) {
      return;
    }

    mountEl.parentElement?.removeChild(mountEl);
    rootEl.innerHTML = '';

    new Scrubby({
      target: rootEl,
      props: acto(getMountValue(mountEl))
    });
  });

  selectMounts('test').forEach(
    mountEl =>
      new Test({
        target: mountEl,
        props: {
          ...acto(getMountValue(mountEl)),
          hasSubsequentContent: true,
          isThemeable: false
        }
      })
  );
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[olympics-2021-diving] public path: ${__webpack_public_path__}`);
}
