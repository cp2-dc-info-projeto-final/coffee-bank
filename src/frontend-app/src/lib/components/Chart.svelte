<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, registerables, type ChartConfiguration } from 'chart.js';

  // Registrar todos os componentes do Chart.js
  Chart.register(...registerables);

  export let type: string = 'line'; // line, bar, pie, doughnut
  export let data: any = {};
  export let options: any = {};
  export let width: number = 400;
  export let height: number = 200;

  let canvas: HTMLCanvasElement;
  let chartInstance: Chart | null = null;

  onMount(() => {
    if (canvas && data) {
      const config: ChartConfiguration = {
        type: type as any,
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as any,
            },
          },
          ...options
        }
      };
      chartInstance = new Chart(canvas, config);
    }
  });

  // Atualizar gráfico quando os dados mudarem
  $: if (chartInstance && data) {
    chartInstance.data = data;
    chartInstance.update();
  }

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
</script>

<div class="chart-container" style="width: {width}px; height: {height}px;">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-container {
    position: relative;
  }
</style>