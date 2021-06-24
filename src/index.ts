import acto from '@abcnews/alternating-case-to-object';
import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import Test from './components/Test/Test.svelte';

whenOdysseyLoaded.then(() => {
  selectMounts('test').forEach(
    mountEl =>
      new Test({
        target: mountEl,
        props: acto(getMountValue(mountEl))
      })
  );
});

if (process.env.NODE_ENV === 'development') {
  console.debug(`[olympics-2021-diving] public path: ${__webpack_public_path__}`);
}
