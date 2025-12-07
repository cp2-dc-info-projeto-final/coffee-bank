<script lang="ts">
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
    import { onMount } from 'svelte';
    import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
    import ChartDataLabels from 'chartjs-plugin-datalabels';

    // Registrar módulos do Chart.js
    ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

    let canvas: HTMLCanvasElement;
    let chart: ChartJS;

    // Exemplo genérico
    
    onMount(async () => {
        let UserInvestment=await api.get("./investment/UserInvestments")
        let MeusInvestimentos=UserInvestment?.data?.Data?.Rows
        const top7 = MeusInvestimentos
  .sort((a, b) => b.valor - a.valor)  // ordena do maior para o menor
  .slice(0, 7); 
        const labels = [top7.map((element)=>{return element.Nome})];
        const valores = top7.map((element)=>{return element.ValorTotal})

    let BarData = {
        labels,
        datasets: [
            {
                label: "Valores",
                data: valores,
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(240, 147, 251, 0.8)',
                    'rgba(245, 87, 108, 0.8)',
                    'rgba(67, 206, 162, 0.8)'
                ],
                borderRadius: 8,
                borderSkipped: false,
                borderWidth: 0
            }
        ]
    };

    let BarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                color: '#fff',
                formatter: (value: any, context: any) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    return `${label}`;
                },
                font: {
                    weight: "bold",
                    size: 15
                }
            },
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: "#fff",
                    font: { size: 14, weight: "500" }
                }
            },
            title: {
                display: true,
                text: "📊 Gráfico de Barras Genérico",
                color: "#fff",
                font: { size: 18, weight: "bold" }
            },
            tooltip: {
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                backgroundColor: "rgba(0,0,0,0.8)"
            }
        },

        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: "#fff",
                    font: { size: 12 }
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#fff",
                    font: { size: 12 }
                },
                grid: {
                    color: "rgba(255,255,255,0.1)",
                    drawBorder: false
                }
            }
        },

        animation: {
            duration: 1500,
            easing: "easeOutQuart"
        }
    };

        chart = new ChartJS(canvas, {
            type: "bar",
            data: BarData,
            options: BarOptions
        });

        return () => chart?.destroy();
    });
</script>

<style>
    canvas {
        width: 100%;
        height: 300px;
        max-height: 400px;
    }
</style>

<canvas bind:this={canvas} class="mx-auto"></canvas>
