<script lang="ts">
  import src from './hero.svg';
</script>

<div>
  <figure>
    <iframe title="A person judging divers on TV from their sofa" frameBorder="0" {src} />
  </figure>
</div>

<style>
  div {
    margin: -1.25rem auto 0;
    width: 100%;
    max-width: 31.25rem;
  }

  figure {
    position: relative;
    margin: 0;
    padding-bottom: calc(100% / 500 * 436);
    width: 100%;
    height: 0;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    border: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
