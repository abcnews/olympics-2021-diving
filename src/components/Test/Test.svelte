<script lang="ts">
  import {
    CONFIGS,
    bAttr,
    getDetailedReaction,
    getEstimateScoreDiff,
    getInitialReaction,
    formatScore,
    formatScoreAsFraction,
    widont
  } from './constants';
  import type { OneOrTwoValues, RangeSliderStopEvent } from './constants';
  import { fade, fly } from 'svelte/transition';
  import RangeSlider from 'svelte-range-slider-pips';

  export let id: string;

  const config = CONFIGS[id];

  if (!config) {
    throw new Error('Unrecognised ID');
  }

  const { question, score } = config;

  let values: OneOrTwoValues = [5];
  let estimate: number;

  $: hasGuessed = typeof estimate === 'number';
  $: isEstimateHigherThanScore = hasGuessed && estimate > score;
  $: isEstimateWithinOnePointOfScore = hasGuessed && getEstimateScoreDiff(estimate, score) <= 1;

  const guess = () => {
    estimate = values[0];
    values = ([...new Set([estimate, score])] as OneOrTwoValues).sort((a, b) => a - b);
  };
</script>

<aside>
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
    data-has-guessed={bAttr(hasGuessed)}
    data-is-estimate-within-one-point-of-score={bAttr(isEstimateWithinOnePointOfScore)}
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
      handleFormatter={hasGuessed ? formatScore : formatScoreAsFraction}
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
</aside>

<style>
  aside {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    max-width: 21.5625rem;
    font-family: ABCSans, sans-serif;
    text-align: center;

    --test-primary-colour: #017987;
    --test-primary-inactive-colour: #c5e2e6;
    --range-handle: var(--test-primary-colour);
    --range-handle-focus: var(--test-primary-colour);
    --range-handle-inactive: var(--test-primary-colour);
    --range-float-text: #000;
    --range-pip: #fff;
    --range-pip-text: #000;
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
    color: var(--test-primary-colour, #000);
  }

  .input {
    position: relative;
    width: 100%;
  }

  .input :global(.rangeSlider) {
    margin: 1em;
    border-radius: 0;
    height: 0.375rem;
    background-image: linear-gradient(
      to right,
      #5b5b5b,
      #5b5b5b 20%,
      #7b7b7b 20%,
      #7b7b7b 40%,
      #979797 40%,
      #979797 60%,
      #b1b1b1 60%,
      #b1b1b1 80%,
      #d7d7d7 80%,
      #d7d7d7
    );
  }

  .input :global(.rangeSlider.disabled) {
    opacity: 1;
  }

  .input :global(.rangeSlider) :global(.rangeHandle) {
    width: 1.5rem;
    height: 1.5rem;
    top: 50%;
  }

  .input :global(.rangeSlider.disabled) :global(.rangeHandle) {
    width: 0.25rem;
    height: 1.25rem;
  }

  .input :global(.rangeSlider) :global(.rangeHandle.hoverable.press)::before,
  .input :global(.rangeSlider) :global(.rangeHandle.hoverable.press:hover)::before {
    box-shadow: 0 0 0 10px var(--handle-border);
  }

  .input :global(.rangeNub) {
    cursor: pointer;
  }

  .input :global(.rangeHandle)::before,
  .input :global(.rangeNub) {
    border: 0.125rem solid #fff;
  }

  .input :global(.rangeNub),
  .input :global(.rangeHandle.active) :global(.rangeNub) {
    background-color: var(--test-primary-colour);
  }

  .input :global(.rangeSlider.disabled) :global(.rangeNub) {
    transform: none !important;
    border: 0;
    border-radius: 0 !important;
    background-color: #000;
    transition: none;
  }

  .input :global(.rangeFloat) {
    opacity: 1;
    top: -0.2em;
    font-size: 0.9375rem;
    line-height: 1.2;
  }

  .input :global(.rangeFloat),
  .input :global(.rangeSlider.focus) :global(.rangeFloat) {
    background-color: transparent;
    transition: none;
  }

  .input[data-is-estimate-within-one-point-of-score] :global(.rangeHandle):nth-last-child(4) :global(.rangeFloat) {
    transform: translate(-100%, -100%);
  }

  .input[data-is-estimate-within-one-point-of-score] :global(.rangeHandle):nth-last-child(3) :global(.rangeFloat) {
    transform: translate(0, -100%);
  }

  .input[data-has-guessed] :global(.rangeFloat)::before {
    content: 'YOU';
    transform: translate(-50%, -75%);
    position: absolute;
    top: 0;
    left: 50%;
    letter-spacing: -0.025em;
  }

  .input[data-has-guessed][data-is-estimate-higher-than-score]
    :global(.rangeHandle):nth-last-child(4)
    :global(.rangeFloat)::before,
  .input[data-has-guessed]:not([data-is-estimate-higher-than-score])
    :global(.rangeHandle):nth-last-child(3)
    :global(.rangeFloat)::before {
    content: 'JUDGE';
  }

  .input[data-has-guessed] :global(.rangeHandle):nth-last-child(2) :global(.rangeFloat)::before {
    content: 'BOTH';
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
    font-size: 0.6875rem;
    font-weight: bold;
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
    background-color: var(--test-primary-colour, #000);
    color: #fff;
    font-family: inherit;
    font-size: 1.125rem;
    transition: background-color 0.25s;
    cursor: pointer;
  }

  button:hover,
  button:focus {
    background-color: var(--test-primary-colour, #333);
  }

  button[disabled] {
    background-color: var(--test-primary-inactive-colour, #ccc);
    cursor: default;
  }
</style>
