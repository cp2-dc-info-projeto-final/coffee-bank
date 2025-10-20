<script lang="ts">
    import Nav from "../../../Components/Navs/UserLogin.svelte"
    import Pie from '$lib/components/Pie.svelte';
  
  const data = {
    labels: ['Aluguel', 'Alimentação'],
    datasets: [
      {
        data: [(1200/1800 * 100).toFixed(2), (600/1800 * 100).toFixed(2)],
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
        return `${label}: ${value}`;
      },
      font: {
        weight: 'bold',
        size: 14
      }
    },
      title: {
        display: true,
        text: 'Gastos Mensais'
      }
    }
  };
</script>
  
<Nav/>
<div class="flex flex-1">
    <div class="flex-row mt-5 w-auto">
        <Pie {data} {options}/>
    </div>
</div>