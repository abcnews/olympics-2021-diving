<script lang="ts">
  import {
    CONFIGS,
    bAttr,
    getDetailedReaction,
    getEstimateScoreDiff,
    getInitialReaction,
    formatScore,
    widont
  } from './constants';
  import type { OneOrTwoValues } from './constants';
  import { fade, fly } from 'svelte/transition';
  import RangeSlider from 'svelte-range-slider-pips';

  export let id: string;
  export let hasSubsequentContent: boolean = false;
  export let isThemeable: boolean = true;

  const config = CONFIGS[id];

  if (!config) {
    throw new Error('Unrecognised ID');
  }

  const { question, score } = config;

  let el: HTMLElement;
  let values: OneOrTwoValues = [5];
  let estimate: number;

  $: hasGuessed = typeof estimate === 'number';
  $: isEstimateHigherThanScore = hasGuessed && estimate > score;
  $: isEstimateWithinPointOfScore = hasGuessed && getEstimateScoreDiff(estimate, score) <= 1;

  const guess = () => {
    estimate = values[0];
    values = ([...new Set([estimate, score])] as OneOrTwoValues).sort((a, b) => a - b);

    // Clear Odyssey's min-height on the component's mount point
    if (el.parentElement && el.parentElement.style.getPropertyValue('min-height').length > 0) {
      el.parentElement.style.removeProperty('min-height');
    }
  };

  const continueReading = () => {
    const { bottom } = el.getBoundingClientRect();

    window.scrollBy(0, bottom);
  };
</script>

<aside bind:this={el} data-has-guessed={bAttr(hasGuessed)} data-is-themeable={isThemeable ? '' : undefined}>
  <div class="status" aria-live="assertive">
    {#if hasGuessed}
      <p class="reaction" in:fly={{ delay: 250, duration: 500, y: 16 }}>
        {`${getInitialReaction(estimate, score)} ${widont(getDetailedReaction(estimate, score))}`}
      </p>
    {:else}
      <p out:fly={{ duration: 375, y: -16 }}>{widont(question)}</p>
    {/if}
  </div>
  <div
    class="input"
    data-is-estimate-within-point-of-score={bAttr(isEstimateWithinPointOfScore)}
    data-is-estimate-higher-than-score={bAttr(isEstimateHigherThanScore)}
  >
    <RangeSlider
      disabled={hasGuessed}
      bind:values
      min={0}
      max={10}
      step={0.5}
      range={values.length === 2}
      float
      pips
      pipstep={2}
      first="label"
      last="label"
      springValues={{ stiffness: 1, damping: 1 }}
      handleFormatter={formatScore}
    />
    {#if !hasGuessed}
      <div class="hint" role="none" out:fade={{ duration: 125 }}>
        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 15L0.999999 8L8 1"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Slide</span>
        <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 15L0.999999 8L8 1"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    {/if}
  </div>
  <button on:click={guess} disabled={hasGuessed}>Lock it in</button>
  {#if hasSubsequentContent && !hasGuessed}
    <footer>
      …or <button on:click={continueReading}>continue reading</button>…
    </footer>
  {/if}
</aside>

<style>
  aside {
    --test-text: #000;
    --test-text-inverted: #fcfcfc;
    --test-primary-colour: #017987;
    --test-primary-inactive-colour: #c5e2e6;
    --test-scale-colour: #949494;

    --range-slider: var(--test-primary-colour);
    --range-handle: var(--test-primary-colour);
    --range-handle-focus: var(--test-primary-colour);
    --range-handle-inactive: var(--test-primary-colour);
    --range-float-text: var(--test-text);
    --range-pip: var(--test-text-inverted);
    --range-pip-text: var(--test-text);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding-bottom: 50vh;
    width: 100%;
    max-width: 21.5625rem;
    color: var(--test-text);
    font-family: ABCSans, sans-serif;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    aside[data-is-themeable] {
      --test-text: #fff;
      --test-text-inverted: #000;
      --test-primary-colour: #86f1f7;
      --test-primary-inactive-colour: #1b3031;
    }
  }

  :global(:last-of-type) > aside,
  aside[data-has-guessed] {
    padding-bottom: 0;
  }

  aside > * {
    margin: 0 0 2.5rem;
  }

  aside > :last-child {
    margin-bottom: 0;
  }

  .status {
    position: relative;
    width: 100%;
    height: 6.5rem;
  }

  .status p {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    width: 100%;
    font-family: ABCSerif, sans-serif;
    font-size: 1.5625rem;
    font-weight: bold;
  }

  @media (max-width: 22.4375rem) {
    .status p {
      font-size: 1.3125rem;
    }
  }

  .status .reaction {
    color: var(--test-primary-colour);
  }

  .input {
    position: relative;
    width: 100%;
  }

  .input :global(.rangeSlider) {
    margin: 1em;
    border-radius: 0;
    height: 0.375rem;
    background-color: var(--test-scale-colour);
  }

  .input :global(.rangeSlider.disabled) {
    opacity: 1;
  }

  .input :global(.rangeSlider) :global(.rangeHandle) {
    top: -90%;
    width: 1.5rem;
    height: 2.25rem;
  }

  @keyframes paddleUpClockwise {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) rotate(-30deg);
    }
  }

  @keyframes paddleUpAnticlockwise {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) rotate(30deg);
    }
  }

  [data-has-guessed] > .input[data-is-estimate-higher-than-score] :global(.rangeHandle):nth-last-child(4),
  [data-has-guessed] > .input:not([data-is-estimate-higher-than-score]) :global(.rangeHandle):nth-last-child(3) {
    --slider: var(--test-text);
    z-index: 4 !important;
    transform-origin: 50% 100%;
  }

  [data-has-guessed] > .input[data-is-estimate-higher-than-score] :global(.rangeHandle):nth-last-child(4) {
    animation: paddleUpClockwise 0.5s;
  }

  [data-has-guessed] > .input:not([data-is-estimate-higher-than-score]) :global(.rangeHandle):nth-last-child(3) {
    animation: paddleUpAnticlockwise 0.5s;
  }

  .input :global(.rangeSlider) :global(.rangeHandle)::before {
    opacity: 1 !important;
    transform: translate(-50%, -50%);
    top: 50%;
    right: auto;
    left: 50%;
    bottom: auto;
    border: 0.0625rem solid var(--test-text-inverted);
    border-radius: 0 !important;
    width: 0.4375rem;
    height: 100%;
    background-color: var(--slider);
    box-shadow: none !important;
    transition: none;
  }

  .input :global(.rangeNub) {
    transform: none !important;
    border-radius: 0 !important;
    background-color: transparent;
    cursor: pointer;
    transition: none;
  }

  .input :global(.rangeNub),
  .input :global(.rangeSlider.disabled) :global(.rangeNub),
  .input :global(.rangeSlider.focus) :global(.rangeNub),
  .input :global(.rangeSlider) :global(.rangeHandle.active) :global(.rangeNub) {
    background-color: transparent;
  }

  .input :global(.rangeSlider.disabled) :global(.rangeNub) {
    cursor: default;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }

  [data-has-guessed] > .input :global(.rangeNub)::before {
    content: 'YOU';
    transform: translate(-50%, 0%);
    position: absolute;
    bottom: -1.25rem;
    left: 50%;
    color: var(--test-text);
    font-size: 0.75rem;
    font-weight: bold;
    letter-spacing: -0.025em;
    animation: fadeIn 0.5s 0.25s both;
  }

  [data-has-guessed]
    > .input[data-is-estimate-higher-than-score]
    :global(.rangeHandle):nth-last-child(4)
    :global(.rangeNub)::before,
  [data-has-guessed]
    > .input:not([data-is-estimate-higher-than-score])
    :global(.rangeHandle):nth-last-child(3)
    :global(.rangeNub)::before {
    content: 'JUDGE';
    animation-delay: 0.5s;
  }

  [data-has-guessed] > .input :global(.rangeHandle):nth-last-child(2) :global(.rangeNub)::before {
    content: 'BOTH';
  }

  .input[data-is-estimate-within-point-of-score] :global(.rangeHandle):nth-last-child(4) :global(.rangeNub)::before {
    transform: translate(-87.5%, 0);
  }

  .input[data-is-estimate-within-point-of-score] :global(.rangeHandle):nth-last-child(3) :global(.rangeNub)::before {
    transform: translate(-12.5%, 0);
  }

  .input :global(.rangeFloat),
  .input :global(.rangeSlider) :global(.rangeHandle.active) :global(.rangeFloat),
  .input :global(.rangeHandle.hoverable):hover :global(.rangeFloat),
  .input :global(.rangeSlider.focus) :global(.rangeFloat) {
    opacity: 1;
    transform: translate(-50%, -50%);
    top: 0.125rem;
    background-color: transparent;
    transition: none;
  }

  .input :global(.rangeFloat) {
    border-radius: 0;
    padding: 0;
    width: 1.875rem;
    height: 1.875rem;
    color: var(--test-text-inverted);
    font-size: 0.8125rem;
    line-height: 2.375;
    text-align: center;
    letter-spacing: 0.025em;
    transition: color 0.25s;
  }

  .input[data-is-estimate-within-point-of-score]:not([data-is-estimate-higher-than-score])
    :global(.rangeHandle):nth-last-child(4)
    :global(.rangeFloat),
  .input[data-is-estimate-within-point-of-score][data-is-estimate-higher-than-score]
    :global(.rangeHandle):nth-last-child(3)
    :global(.rangeFloat) {
    color: transparent;
  }

  .input :global(.rangeFloat)::before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    border: 0.0625rem solid var(--test-text-inverted);
    border-radius: 50%;
    width: 100%;
    height: 100%;
    background-color: var(--slider);
  }

  .input :global(.rangeSlider) :global(.rangeHandle)::after {
    content: '';
    transform: translate(-50%, -100%);
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.3125rem;
    height: 0.3125rem;
    background-color: var(--slider);
  }

  .input :global(.rangeBar) {
    z-index: unset;
    border-radius: 0;
    height: 100%;
  }

  .input :global(.rangePips) {
    top: 0;
    bottom: auto;
    height: 100%;
  }

  .input :global(.rangePips.pip-labels) {
    margin-bottom: 2em;
  }

  .input :global(.pip) {
    top: 0;
    height: 100%;
  }

  .input :global(.pip.in-range) {
    background-color: var(--pip);
  }

  .input :global(.pip.selected) {
    height: 0.5rem;
    background-color: var(--pip);
    color: var(--pip-text);
  }

  .input :global(.pip):first-child,
  .input :global(.pip):last-child,
  .input :global(.pip):nth-child(2n) {
    background-color: transparent;
  }

  .input :global(.pipVal) {
    font-size: 1.0625rem;
    font-weight: bold;
  }

  .input :global(.pip.selected) > :global(.pipVal) {
    top: 0.4em;
  }

  .input :global(.first) > :global(.pipVal) {
    transform: translate(calc(-100% - 0.5em), -66.67%);
  }

  .input :global(.last) > :global(.pipVal) {
    transform: translate(0.5em, -66.67%);
  }

  .input :global(.pipVal)::before {
    position: absolute;
    bottom: 1rem;
  }

  .hint {
    transform: translate(-50%, 0);
    position: absolute;
    bottom: -1rem;
    left: 50%;
    color: var(--test-primary-colour);
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    pointer-events: none;
  }

  .hint > * {
    margin: 0 0.0625rem;
    vertical-align: middle;
  }

  .hint > svg:last-child {
    transform: rotate(180deg);
  }

  button {
    border: 0;
    padding: 0.5rem 2.25rem;
    background-color: var(--test-primary-colour);
    color: var(--test-text-inverted);
    font-family: inherit;
    font-size: 1.125rem;
    transition: background-color 0.25s;
    cursor: pointer;
  }

  button:hover,
  button:focus {
    background-color: var(--test-primary-colour);
  }

  button[disabled] {
    background-color: var(--test-primary-inactive-colour);
    cursor: default;
  }

  footer {
    font-size: 0.875rem;
  }

  :global(:last-child) > aside footer {
    display: none;
  }

  footer button {
    padding: 0;
    background-color: transparent;
    color: var(--test-primary-colour);
    font-size: 1em;
  }

  footer button:hover,
  footer button:focus {
    background-color: transparent;
  }
</style>
