<script lang="ts">
    import Nav from "../../../Components/Navs/UserLogin.svelte"
    import Pie from '$lib/components/Pie.svelte';
    import Plot from "$lib/components/Chart.svelte"
  const data = {
    labels: ['Investido', 'Não investido'],
    datasets: [
      {
        data: [(1200).toFixed(2), (600).toFixed(2)],
        backgroundColor: ['#ff6384', '#36a2eb'],
        hoverOffset: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'false'
      },
      datalabels: {
      color: '#fff',
      formatter: (value, context) => {
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
        text: 'Gastos Mensais',
        color: '#fff',
      }
    }
  };
  let Linedata = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
    datasets: [
      {
        label: 'Vendas 2025',
        data: [120, 150, 180, 90, 250, 300],
        tension: 0.4, // suaviza a linha
        fill: true,   // preenche área abaixo da linha
        pointRadius: 10,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointHoverRadius: 7
      }
    ]
  };

  // Opções de aparência e comportamento
  let Lineoptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: '#fff' }
      },
      title: {
        display: true,
        text: 'Meus investimentos',
        color: '#fff',
        font: { size: 18, weight: 'bold',color: '#fff' }
      },
      tooltip: {
        titleFont: { size: 14,color: '#fff' },
        bodyFont: { size: 13,color: '#fff' },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: '#fff' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: '#fff' }
      }
    }
  };
  let Bardata = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
    datasets: [
      {
        label: 'Numero de ações',
        data: [120, 90, 150, 80, 200],
        backgroundColor: [
          'oklch(66.6% 0.179 58.318)',
          'oklch(66.6% 0.179 58.318)',
          'oklch(66.6% 0.179 58.318)',
          'oklch(66.6% 0.179 58.318)',
          'oklch(66.6% 0.179 58.318)'
        ],
        borderRadius: 8, // bordas arredondadas das barras
        borderSkipped: false
      }
    ]
  };

  // configurações do gráfico
  let Baroptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: { size: 14,color: '#fff' }
        }
      },
      title: {
        display: true,
        text: '📊 Diversidade de ações - 2025',
        color: '#fff',
        font: { size: 18,color: '#fff', weight: 'bold' }
      },
      tooltip: {
        titleFont: { size: 14,color: '#fff' },
        bodyFont: { size: 13,color: '#fff', },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#fff' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#fff' },
        grid: { color: 'rgba(0,0,0,0.05)' }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };
</script>
  
<Nav/>
<div class="flex flex-1">
    <div class="flex-col ms-5 mt-5 w-auto " id="legal">
        <Pie {data} {options}/>
    </div>
    <div class="w-75 h-75">
      <Plot type="line" data={Linedata} options={Lineoptions}/>
    </div>
    <div class="w-75 h-75">
      <Plot type="bar" data={Bardata} options={Baroptions}/>
    </div>
    <div class="w-75 h-75">
      <Plot type="line" data={Linedata} options={Lineoptions}/>
    </div>
</div>