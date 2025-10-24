<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, registerables, type ChartConfiguration } from 'chart.js';

  Chart.register(...registerables);

  export let type: string = 'line'; // line, bar, pie, doughnut
  export let data: any = {};
  export let options: any = {};

  let canvas: HTMLCanvasElement;
  let chartInstance: Chart | null = null;

  onMount(() => {
    if (canvas && data) {
      const config: ChartConfiguration = {
        type: type as any,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false, // 👈 permite ocupar toda a altura
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

  // Atualiza o gráfico quando os dados mudarem
  $: if (chartInstance && data) {
    chartInstance.data = data;
    chartInstance.update();
  }

  onDestroy(() => {
    chartInstance?.destroy();
  });
  
</script>

<!-- 👇 O container define o tamanho -->
<div class="chart-container">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
.chart-container {
  width: 100%;
  height: 100%; /* ocupa toda a altura do pai */
  position: relative; /* necessário para o Chart.js */
}

canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
