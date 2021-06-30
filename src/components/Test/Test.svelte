<script lang="ts">
  import { CONFIGS, getDetailedReaction, getInitialReaction, formatHandleValue, formatPipValue } from './constants';
  import RangeSlider from 'svelte-range-slider-pips';

  export let id: string;

  const config = CONFIGS[id];

  if (!config) {
    throw new Error('Unrecognised ID');
  }

  const { question, score } = config;

  let values = [5];
  let hasGuessed = false;
</script>

<aside>
  <p>{question}</p>
  <div class="input">
    <RangeSlider
      bind:values
      disabled={hasGuessed}
      min={0}
      max={10}
      step={0.5}
      float
      pips
      pipstep={2}
      first="label"
      last="label"
      formatter={formatPipValue}
      handleFormatter={formatHandleValue}
    />
    <div class="hint" role="none">
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
  </div>
  <button on:click={() => (hasGuessed = true)} disabled={hasGuessed}>Lock it in</button>
  <div class="reaction">
    {#if hasGuessed}
      <p>{getInitialReaction(values[0], score)}</p>
      <p>{getDetailedReaction(values[0], score)}</p>
    {/if}
  </div>
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

    --range-handle: var(--colour-accent);
    --range-handle-focus: var(--colour-accent-active);
    --range-float-text: #000;
    --range-pip: #fff;
    --range-pip-text: #000;
  }

  aside > * {
    margin: 0 0 2rem;
  }

  aside > :last-child {
    margin-bottom: 0;
  }

  p {
    font-family: ABCSerif, sans-serif;
    font-size: 1.5625rem;
    font-weight: bold;
  }

  .input {
    position: relative;
    width: 100%;
    font-size: 1.16rem;
  }

  .input :global(.rangeSlider) {
    border-radius: 0;
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

  .input :global(.rangeSlider) :global(.rangeHandle.hoverable.press)::before,
  .input :global(.rangeSlider) :global(.rangeHandle.hoverable.press:hover)::before {
    box-shadow: 0 0 0 10px var(--handle-border);
  }

  .input :global(.rangeNub) {
    cursor: pointer;
  }

  .input :global(.rangeHandle)::before,
  .input :global(.rangeNub) {
    border: 0.125rem solid #000;
  }

  .input :global(.rangeNub),
  .input :global(.rangeHandle.active) :global(.rangeNub) {
    background-color: #fff;
  }

  .input :global(.rangeFloat) {
    opacity: 1;
    top: -0.2em;
  }

  .input :global(.rangeFloat),
  .input :global(.rangeSlider.focus) :global(.rangeFloat) {
    background-color: transparent;
  }

  .input :global(.rangePips) {
    height: 0.5625rem;
    top: 0;
    bottom: auto;
  }

  .input :global(.rangePips.pip-labels) {
    margin-bottom: 2em;
  }

  .input :global(.pip) {
    top: 0;
    height: 0.5625rem;
  }

  .input :global(.pip.selected) {
    height: 0.5625rem;
    color: var(--pip-text);
    background-color: var(--pip);
  }

  .input :global(.pip):first-child,
  .input :global(.pip):last-child,
  .input :global(.pip):nth-child(2n) {
    background-color: transparent;
  }

  .input :global(.pipVal) {
    margin-top: 2.25em;
    font-size: 0.6875rem;
    font-weight: bold;
  }

  .input :global(.pip.selected) > :global(.pipVal) {
    top: 0.4em;
  }

  .input :global(.first) > :global(.pipVal) {
    transform: translate(0, 25%);
  }

  .input :global(.last) > :global(.pipVal) {
    transform: translate(-100%, 25%);
  }

  .input :global(.pipVal)::before {
    position: absolute;
    bottom: 1rem;
  }

  .input :global(.first) > :global(.pipVal)::before {
    content: 'Lowest';
  }

  .input :global(.last) > :global(.pipVal)::before {
    content: 'Highest';
    right: 0;
  }

  .hint {
    transform: translate(-50%, 0);
    position: absolute;
    bottom: 1.25rem;
    left: 50%;
    color: #949494;
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
    background-color: var(--colour-accent, #000);
    color: #fff;
    font-family: inherit;
    font-size: 1.125rem;
    transition: opacity 0.25s;
    cursor: pointer;
  }

  button:hover,
  button:focus {
    background-color: var(--colour-accent-active, #333);
  }

  button[disabled] {
    background-color: var(--colour-accent-faded, #ccc);
    cursor: default;
  }

  .reaction {
    min-height: 16rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(0, 0.5rem);
    }
  }

  .reaction > * {
    animation: fadeIn 0.5s 0.25s both ease-out;
  }
</style>
