<script lang="ts">
    import { onMount } from 'svelte';
    import axios from 'axios';
        let token = null;
if (typeof window !== 'undefined') {
  token = sessionStorage.getItem("auth_token");
}
    const api = axios.create({
        baseURL: 'http://localhost:3000',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Barre: ${token}`
        },
    });

    import { Chart as ChartJS, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';
    ChartJS.register(PieController, ArcElement, Tooltip, Legend, ChartDataLabels);
    let canvas: HTMLCanvasElement;
  
    ChartJS.register(PieController, ArcElement, Tooltip, Legend);
  
    let options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: '#fff',
                    font: { size: 14, weight: '500' },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            datalabels: {
                color: '#fff',
                formatter: (value: any, context: any) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    return `${label}`;
                },
                font: {
                    weight: 'bold',
                    size: 15,
                    color: '#fff'
                }
            },
            title: {
                display: true,
                text: '💰 Distribuição de Investimentos',
                color: '#fff',
                font: { size: 18, weight: 'bold' }
            }
        }
    };
    let chart: ChartJS;
  
    onMount(async() => {
    let json=await api.put('./users/SaldoCarteiraUsuario')
        console.log(json)
        let data={
    labels: ['Investido', 'Não investido'],
    datasets: [
      {
        data: [json.data.data.Saldo,Number(json.data.data.Valor)],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)'
        ],
        hoverOffset: 4,
        borderWidth: 0
      }
    ]
  }
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

<canvas bind:this={canvas} class="mx-auto"></canvas>