<script lang="ts">
    import Nav from "../../../Components/Navs/UserLogin.svelte"
    import Pie from '$lib/components/Pie.svelte';
    import Plot from "$lib/components/Chart.svelte"
    import { onMount } from 'svelte';

    // Animações de entrada
    let chartContainerVisible = false;
    let statsVisible = false;
    let chartsVisible = false;

    // Estados para modais de resumo
    let showPieSummary = false;
    let showLineSummary = false;
    let showBarSummary = false;
    let showLine2Summary = false;

    // Funções para gerar resumos dos dados
    function getPieSummary() {
        const total = 1200 + 600;
        const investedPercent = Number(((1200 / total) * 100).toFixed(1));
        const notInvestedPercent = Number(((600 / total) * 100).toFixed(1));
        
        return {
            title: "Distribuição de Investimentos",
            summary: `Você tem R$ 1.200,00 investidos (${investedPercent}%) e R$ 600,00 não investidos (${notInvestedPercent}%). 
            Seu portfólio está ${investedPercent > 50 ? 'bem diversificado' : 'concentrado em investimentos'}. 
            ${investedPercent > 70 ? 'Excelente! Você está investindo a maior parte do seu capital.' : 
            investedPercent > 40 ? 'Bom! Considere aumentar seus investimentos gradualmente.' : 
            'Considere investir mais para maximizar seus retornos.'}`
        };
    }

    function getLineSummary() {
        const data = [120, 150, 180, 90, 250, 300];
        const growth = Number(((300 - 120) / 120 * 100).toFixed(1));
        const avgGrowth = Number((data.reduce((a, b) => a + b, 0) / data.length).toFixed(0));
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        
        return {
            title: "Evolução do Portfólio",
            summary: `Seu portfólio cresceu ${growth}% nos últimos 6 meses, de R$ 120 para R$ 300. 
            O valor médio foi R$ ${avgGrowth}, com pico de R$ ${maxValue} e menor valor de R$ ${minValue}. 
            ${growth > 50 ? 'Performance excepcional! Continue assim.' : 
            growth > 20 ? 'Bom crescimento! Mantenha a estratégia.' : 
            'Considere revisar sua estratégia de investimento.'}`
        };
    }

    function getBarSummary() {
        const data = [120, 90, 150, 80, 200];
        const total = data.reduce((a, b) => a + b, 0);
        const avg = (total / data.length).toFixed(0);
        const maxMonth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'][data.indexOf(Math.max(...data))];
        const minMonth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'][data.indexOf(Math.min(...data))];
        
        return {
            title: "Diversificação de Ações",
            summary: `Você possui ${total} ações no total, com média de ${avg} por mês. 
            Maior aquisição em ${maxMonth} (${Math.max(...data)} ações) e menor em ${minMonth} (${Math.min(...data)} ações). 
            ${total > 500 ? 'Excelente diversificação! Você tem muitas ações.' : 
            total > 200 ? 'Boa diversificação. Continue diversificando.' : 
            'Considere aumentar o número de ações para melhor diversificação.'}`
        };
    }

    function getLine2Summary() {
        const data = [8.5, 12.3, 15.7, 18.2];
        const totalReturn = data.reduce((a, b) => a + b, 0);
        const avgReturn = Number((totalReturn / data.length).toFixed(1));
        const bestQuarter = ['Q1', 'Q2', 'Q3', 'Q4'][data.indexOf(Math.max(...data))];
        
        return {
            title: "Rendimento Trimestral",
            summary: `Seu rendimento anual total foi de ${totalReturn.toFixed(1)}%, com média de ${avgReturn}% por trimestre. 
            Melhor trimestre foi ${bestQuarter} com ${Math.max(...data)}% de rendimento. 
            ${avgReturn > 15 ? 'Performance excepcional! Rendimentos muito acima da média.' : 
            avgReturn > 10 ? 'Bom rendimento! Acima da inflação e CDI.' : 
            'Considere revisar sua estratégia para melhorar os rendimentos.'}`
        };
    }

    onMount(() => {
        setTimeout(() => {
            chartContainerVisible = true;
        }, 100);
        setTimeout(() => {
            statsVisible = true;
        }, 300);
        setTimeout(() => {
            chartsVisible = true;
        }, 500);
    });

    // Dados do gráfico de pizza
    const data = {
        labels: ['Investido', 'Não investido'],
        datasets: [
            {
                data: [(1200).toFixed(2), (600).toFixed(2)],
                backgroundColor: [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                ],
                hoverOffset: 4,
                borderWidth: 0
            }
        ]
    };

    const options = {
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

    // Dados do gráfico de linha
    let Linedata = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
            {
                label: 'Crescimento do Portfólio',
                data: [120, 150, 180, 90, 250, 300],
                tension: 0.4,
                fill: true,
                pointRadius: 8,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: 'rgba(255, 255, 255, 1)',
                pointBorderWidth: 2,
                pointHoverRadius: 12,
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 3
            }
        ]
    };

    let Lineoptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: { 
                    color: '#fff',
                    font: { size: 14, weight: '500' }
                }
            },
            title: {
                display: true,
                text: '📈 Evolução dos Investimentos',
                color: '#fff',
                font: { size: 18, weight: 'bold' }
            },
            tooltip: {
                titleFont: { size: 14, color: '#fff' },
                bodyFont: { size: 13, color: '#fff' },
                padding: 12,
                cornerRadius: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }
        },
        scales: {
            x: {
                grid: { 
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: { 
                    color: '#fff',
                    font: { size: 12 }
                }
            },
            y: {
                beginAtZero: true,
                grid: { 
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: { 
                    color: '#fff',
                    font: { size: 12 }
                }
            }
        }
    };

    // Dados do gráfico de barras
    let Bardata = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
        datasets: [
            {
                label: 'Número de Ações',
                data: [120, 90, 150, 80, 200],
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

    let Baroptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#fff',
                    font: { size: 14, weight: '500' }
                }
            },
            title: {
                display: true,
                text: '📊 Diversificação de Ações - 2025',
                color: '#fff',
                font: { size: 18, weight: 'bold' }
            },
            tooltip: {
                titleFont: { size: 14, color: '#fff' },
                bodyFont: { size: 13, color: '#fff' },
                padding: 12,
                cornerRadius: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { 
                    color: '#fff',
                    font: { size: 12 }
                }
            },
            y: {
                beginAtZero: true,
                ticks: { 
                    color: '#fff',
                    font: { size: 12 }
                },
                grid: { 
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart'
        }
    };

    // Dados do segundo gráfico de linha
    let Linedata2 = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                label: 'Rendimento Anual',
                data: [8.5, 12.3, 15.7, 18.2],
                tension: 0.4,
                fill: true,
                pointRadius: 8,
                pointBackgroundColor: 'rgba(67, 206, 162, 1)',
                pointBorderColor: 'rgba(255, 255, 255, 1)',
                pointBorderWidth: 2,
                pointHoverRadius: 12,
                backgroundColor: 'rgba(67, 206, 162, 0.1)',
                borderColor: 'rgba(67, 206, 162, 1)',
                borderWidth: 3
            }
        ]
    };
</script>
<Nav/>

<div class="investments-container" class:visible={chartContainerVisible}>
    <!-- Header da página -->
    <div class="page-header" class:visible={statsVisible}>
        <h1 class="page-title">Dashboard de Investimentos</h1>
        <p class="page-subtitle">Acompanhe o desempenho da sua conta</p>
    </div>

    <!-- Cards de estatísticas -->
    <div class="stats-grid" class:visible={statsVisible}>
        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
                <h3>Valor Total</h3>
                <p class="stat-value">R$ 1.800,00</p>
                <span class="stat-change positive">+12.5%</span>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
                <h3>Rendimento</h3>
                <p class="stat-value">R$ 180,00</p>
                <span class="stat-change positive">+8.2%</span>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
                <h3>Meta Anual</h3>
                <p class="stat-value">75%</p>
                <span class="stat-change neutral">No prazo</span>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-content">
                <h3>Performance</h3>
                <p class="stat-value">Excelente</p>
                <span class="stat-change positive">+15.3%</span>
            </div>
        </div>
    </div>

    <!-- Grid de gráficos -->
    <div class="charts-grid" class:visible={chartsVisible}>
        <!-- Gráfico de Pizza -->
        <div class="chart-container pie-chart">
            <div class="chart-header">
                <h3>Distribuição de Investimentos</h3>
                <div class="chart-actions">
                    <button class="action-btn">📊</button>
                    <button class="action-btn eye-btn" on:click={() => showPieSummary = !showPieSummary}>
                        {showPieSummary ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
            </div>
            <div class="chart-content">
                <Pie {data} {options}/>
            </div>
            {#if showPieSummary}
                <div class="summary-modal">
                    <div class="summary-content">
                        <h4>{getPieSummary().title}</h4>
                        <p>{getPieSummary().summary}</p>
                        <button class="close-btn" on:click={() => showPieSummary = false}>✕</button>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Gráfico de Linha -->
        <div class="chart-container line-chart">
            <div class="chart-header">
                <h3>Evolução do Portfólio</h3>
                <div class="chart-actions">
                    <button class="action-btn">📈</button>
                    <button class="action-btn eye-btn" on:click={() => showLineSummary = !showLineSummary}>
                        {showLineSummary ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
            </div>
            <div class="chart-content">
                <Plot type="line" data={Linedata} options={Lineoptions}/>
            </div>
            {#if showLineSummary}
                <div class="summary-modal">
                    <div class="summary-content">
                        <h4>{getLineSummary().title}</h4>
                        <p>{getLineSummary().summary}</p>
                        <button class="close-btn" on:click={() => showLineSummary = false}>✕</button>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Gráfico de Barras -->
        <div class="chart-container bar-chart">
            <div class="chart-header">
                <h3>Diversificação de Ações</h3>
                <div class="chart-actions">
                    <button class="action-btn">📊</button>
                    <button class="action-btn eye-btn" on:click={() => showBarSummary = !showBarSummary}>
                        {showBarSummary ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
            </div>
            <div class="chart-content">
                <Plot type="bar" data={Bardata} options={Baroptions}/>
            </div>
            {#if showBarSummary}
                <div class="summary-modal">
                    <div class="summary-content">
                        <h4>{getBarSummary().title}</h4>
                        <p>{getBarSummary().summary}</p>
                        <button class="close-btn" on:click={() => showBarSummary = false}>✕</button>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Gráfico de Rendimento -->
        <div class="chart-container line-chart">
            <div class="chart-header">
                <h3>Rendimento Trimestral</h3>
                <div class="chart-actions">
                    <button class="action-btn">📈</button>
                    <button class="action-btn eye-btn" on:click={() => showLine2Summary = !showLine2Summary}>
                        {showLine2Summary ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
            </div>
            <div class="chart-content">
                <Plot type="line" data={Linedata2} options={Lineoptions}/>
            </div>
            {#if showLine2Summary}
                <div class="summary-modal">
                    <div class="summary-content">
                        <h4>{getLine2Summary().title}</h4>
                        <p>{getLine2Summary().summary}</p>
                        <button class="close-btn" on:click={() => showLine2Summary = false}>✕</button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .investments-container {
        min-height: 100vh;
        padding: 2rem;
        background: linear-gradient(135deg, #240f00 0%, #1a0a00 50%, #0f0500 100%);
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .investments-container.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .page-header {
        text-align: center;
        margin-bottom: 3rem;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .page-header.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .page-title {
        font-size: 3rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .page-subtitle {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 300;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stats-grid.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .stat-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }

    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        border-color: rgba(102, 126, 234, 0.3);
    }

    .stat-card:hover::before {
        opacity: 1;
    }

    .stat-icon {
        font-size: 2.5rem;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }

    .stat-content h3 {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9rem;
        font-weight: 500;
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .stat-value {
        color: #fff;
        font-size: 1.8rem;
        font-weight: 700;
        margin: 0 0 0.25rem 0;
    }

    .stat-change {
        font-size: 0.85rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
    }

    .stat-change.positive {
        color: #4ade80;
        background: rgba(74, 222, 128, 0.1);
    }

    .stat-change.neutral {
        color: #94a3b8;
        background: rgba(148, 163, 184, 0.1);
    }

    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .charts-grid.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .chart-container {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 1.5rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }

    .chart-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }

    .chart-container:hover {
        transform: translateY(-8px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        border-color: rgba(102, 126, 234, 0.3);
    }

    .chart-container:hover::before {
        opacity: 1;
    }

    .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .chart-header h3 {
        color: #fff;
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
    }

    .chart-actions {
        display: flex;
        gap: 0.5rem;
    }

    .action-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 0.5rem;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }

    .action-btn:hover {
        background: rgba(102, 126, 234, 0.2);
        border-color: rgba(102, 126, 234, 0.4);
        transform: scale(1.05);
    }

    .eye-btn {
        position: relative;
        transition: all 0.3s ease;
    }

    .eye-btn:hover {
        background: rgba(67, 206, 162, 0.2);
        border-color: rgba(67, 206, 162, 0.4);
        transform: scale(1.1);
    }

    .summary-modal {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        animation: fadeIn 0.3s ease;
    }

    .summary-content {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        padding: 2rem;
        max-width: 90%;
        max-height: 80%;
        position: relative;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .summary-content h4 {
        color: #fff;
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0 0 1rem 0;
        text-align: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .summary-content p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1rem;
        line-height: 1.6;
        margin: 0;
        text-align: justify;
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
    }

    .close-btn:hover {
        background: rgba(245, 87, 108, 0.3);
        border-color: rgba(245, 87, 108, 0.5);
        transform: scale(1.1);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .chart-content {
        position: relative;
        height: 300px;
    }

    /* Animações específicas para cada tipo de gráfico */
    .pie-chart {
        animation-delay: 0.1s;
    }

    .line-chart {
        animation-delay: 0.2s;
    }

    .bar-chart {
        animation-delay: 0.3s;
    }

    /* Responsividade */
    @media (max-width: 768px) {
        .investments-container {
            padding: 1rem;
        }

        .page-title {
            font-size: 2rem;
        }

        .charts-grid {
            grid-template-columns: 1fr;
        }

        .stats-grid {
            grid-template-columns: 1fr;
        }

        .chart-content {
            height: 250px;
        }
    }

    @media (max-width: 480px) {
        .page-title {
            font-size: 1.5rem;
        }

        .stat-card {
            padding: 1rem;
        }

        .chart-container {
            padding: 1rem;
        }
    }
</style>