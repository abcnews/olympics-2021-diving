<script lang="ts">
  import { onMount } from 'svelte';
  import LottiePlayer from 'lottie-web';
  import type { LinearScale } from './constants';
  import { CONFIGS, CONFIG_DEFAULTS, createLinearScale } from './constants';

  export let id: string;

  const config = CONFIGS[id];

  if (!config) {
    throw new Error('Unrecognised ID');
  }

  const { dataURL, startVH, endVH, minBlockHeightVH, backgroundColor } = { ...CONFIG_DEFAULTS, ...config };

  let figureEl: HTMLElement;

  onMount(async () => {
    const animation = LottiePlayer.loadAnimation({
      autoplay: false,
      container: figureEl,
      loop: false,
      path: dataURL,
      renderer: 'canvas',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet'
      }
    });

    const parentBlockEl = figureEl.closest('.Block') as HTMLDivElement;

    parentBlockEl.style.setProperty('min-height', `${Math.max(100, minBlockHeightVH)}vh`);

    let progressScale: LinearScale;

    const updateFactors = () => {
      const viewportHeight = window.innerHeight;
      const { height } = parentBlockEl.getBoundingClientRect();
      const domain: [number, number] = [
        (startVH / 100) * viewportHeight,
        -height - (endVH / 100) * viewportHeight + viewportHeight
      ];

      progressScale = createLinearScale(domain, [0, 1], true);
      animation.resize();
    };

    const updateProgress = () => {
      const { top } = parentBlockEl.getBoundingClientRect();
      const progress = progressScale(top);
      const frame = Math.round(progress * (animation.totalFrames - 1));

      animation.goToAndStop(frame, true);
    };

    const updateAll = () => {
      updateFactors();
      updateProgress();
    };

    animation.addEventListener('data_ready', () => {
      updateAll();
      window.addEventListener('resize', () => updateAll());
      window.addEventListener('scroll', () => updateProgress());
    });
  });
</script>

<div class="root" role="none" style={`--background-color: ${backgroundColor}`}>
  <figure bind:this={figureEl} />
</div>

<style>
  .root {
    position: relative;
    overflow: hidden;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    background-color: var(--background-color, #fff);
  }

  :global(.is-fixed) .root {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }

  figure {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  @media (min-width: 61.25rem) {
    figure {
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
      width: 40%;
      height: 80%;
    }

    :global(.Block.has-right) figure {
      left: 30%;
    }

    :global(.Block.has-left) figure {
      left: 70%;
    }
  }

  figure canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    vertical-align: top;
    object-fit: cover;
  }
</style>
