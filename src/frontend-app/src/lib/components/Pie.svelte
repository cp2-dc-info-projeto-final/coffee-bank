<script lang="ts">
    import { onMount } from 'svelte';
    import { Chart as ChartJS, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    ChartJS.register(PieController, ArcElement, Tooltip, Legend, ChartDataLabels);
    let canvas: HTMLCanvasElement;
  
    ChartJS.register(PieController, ArcElement, Tooltip, Legend);
  
    export let data: any;
    export let options: any;
    let chart: ChartJS;
  
    onMount(() => {
      console.log(data)
      console.log("entrou")
      chart = new ChartJS(canvas, {
        type: 'pie',
        data,
        options
      });
  
      return () => {
        chart?.destroy();
      };
    });
  </script>
  
  <canvas bind:this={canvas}></canvas>
  