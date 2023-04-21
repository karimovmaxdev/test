<script lang="js">
  import '../../lib';
  // import '../../lib/src/MyComponent.wc.svelte';


  let cities = [
    'mexico_city',
    'tijuana',
    'ecatepec',
    'puebla',
    'guadalajara',
    'chihuahua',
    'toluca',
    'cancun',
    'chetumal',
    'chalco',
    'chicoloapan'
  ]
  // my-component
  let customElement;




  $: if(customElement) customElement.cities = cities;
  $: if(customElement) customElement.addEventListener('submit', () => console.log('custom submit callback'));
  
</script>

<main>

  <!-- <h1>Hello World!</h1>
  <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p> -->

  <p class="container" >
    <my-component bind:this={customElement}/>
  </p>
</main>

<style>

  /* main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    font-size: 4em;
    line-height: 1.1;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }

    .container {
      display: inline-block;
      max-width: 320px;
    }
  } */
</style>