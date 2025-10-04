<script lang="ts">

  import Svg1 from "../svgs/svg1.svelte";
  import Svg2 from "../svgs/svg2.svelte";
  import Svg3 from "../svgs/svg3.svelte";
  import Svg4 from "../svgs/svg4.svelte";
  import Svg5 from "../svgs/svg5.svelte";
  import Svg6 from "../svgs/svg6.svelte";
  import Svg7 from "../svgs/svg7.svelte";
  import { onMount } from 'svelte';
  function svgPicker(svg:number){
    if(svg=1){
      svg
    }
  }
  export let label="";
  export let stats=0;
  export let svg1="";
  export let svg2="";
  export let extraInfo="";

  function formatNumber(value: number) {
    return new Intl.NumberFormat('pt-BR').format(value);
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-gray-600">{label}</p>
      <p class="text-2xl font-bold text-gray-900 animate-count-up">{formatNumber(stats)}</p>
    </div>
    <div class="w-12 h-12 bg-[#0b8185]/10 rounded-lg flex items-center justify-center animate-pulse">
      {#if svg1=='1'}
        <Svg1/>
      {:else if svg1=='2'}
        <Svg2/>
      {:else if svg1=='3'}
        <Svg3/>
      {:else if svg1=='4'}
        <Svg4/>
      {:else if svg1=='5'}
        <Svg5/>
      {:else if svg1=='6'}
        <Svg6/>
      {:else if svg1=='7'}
        <Svg7/>
      {/if}
      
    </div>
  </div>
  <div class="mt-4 flex items-center text-sm text-[#0b8185] animate-fade-in-up animation-delay-200">
    {#if svg1=='1'}
        <Svg1/>
      {:else if svg2=='2'}
        <Svg2/>
      {:else if svg2=='3'}
        <Svg3/>
      {:else if svg2=='4'}
        <Svg4/>
      {:else if svg2=='5'}
        <Svg5/>
      {:else if svg2=='6'}
        <Svg6/>
      {:else if svg2=='7'}
        <Svg7/>
      {/if}
    {extraInfo}
  </div>
</div>