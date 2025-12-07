<script lang="ts">
    import Nav from "../../../Components/Navs/UserLogin.svelte"
    import Pie from '$lib/components/Graphic/Investiment/Pie.svelte';
    import Bar from '$lib/components/Graphic/Investiment/bar.svelte'
    import Plot from "$lib/components/Chart.svelte"
    import axios from "axios";
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
	import { Label } from "recharts";
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
    let valor=0
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
    function getPieSummary(v1,v2) {
        const total = v1 + v2;
        const investedPercent = Number((v1 / total) * 100).toFixed(1);
        const notInvestedPercent = Number(((v2 / total) * 100).toFixed(1));
        
        return {
            title: "Distribuição de Investimentos",
            summary: `Você tem ${v1} KGB investidos (${investedPercent}%) e  ${v2} KGB não investidos (${notInvestedPercent}%). 
            Seu portfólio está ${investedPercent > 50 ? 'bem diversificado' : 'concentrado em investimentos'}. 
            ${investedPercent > 70 ? 'Excelente! Você está investindo a maior parte do seu capital.' : 
            investedPercent > 40 ? 'Bom! Considere aumentar seus investimentos gradualmente.' : 
            'Considere investir mais para maximizar seus retornos.'}`,
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
        let data=top7.map((element)=>{return element.ValorTotal})
        let label=top7.map((element)=>{return element.Nome})
        const total = data.reduce((a, b) => a + b, 0);

        
        const avg = (total / data.length).toFixed(0);
        const maxMonth = label[data.indexOf(Math.max(...data))];
        const minMonth = label[data.indexOf(Math.min(...data))];
        
        return {
            title: "Diversificação de Ações",
            summary: `Você possui ${data.length<7?data.length:`${total}+`} ações no total, com média de ${avg} por mês, entre as ${data.length} melhores. 
            Maior valor em ${maxMonth} (${Math.max(...data)} KGB) e menor em ${minMonth} (${Math.min(...data)} KBG). 
            ${total > 500 ? 'Excelente resultado! Você tem muito dinheiro.' : 
            total > 200 ? 'Boa renda. Continue investindo.' : 
            'Considere aumentar o número de ações para melhor ganhos.'}`
        };
    }

    function goBackToProfile() {
        if (browser) {
            try {
                goto('/Users');
            } catch (error) {
                window.location.href = '/Users';
            }
        }
    }
    let data={}
    let re=api.put('./users/SaldoCarteiraUsuario')

    // Dados do segundo gráfico de linha
    let MeusInvestimentos:{Preco:Number,Nome: string,NumeroDeReparticoes: Number,AreaTotal: string,AreaPossuida: string}[]=[], id:Number    
    let json={}
    let InfromacoesGeraisMeusInvestimentos={}
    let top7
    onMount(async () => { 
        let UserInvestment=await api.get("./investment/UserInvestments")
        MeusInvestimentos=UserInvestment?.data?.Data?.Rows
        InfromacoesGeraisMeusInvestimentos=UserInvestment?.data?.Data
        top7 = MeusInvestimentos
        .sort((a, b) => b.valor - a.valor)  // ordena do maior para o menor
        .slice(0, 7);
        console.log(MeusInvestimentos)
        json=await api.put('./users/SaldoCarteiraUsuario')
    });
</script>
<Nav/>

<div class="investments-container" class:visible={true}>
    <!-- Header da página -->
    <div class="flex w-full justify-between">
        <button class="back-btn hover:bg-amber-950" on:click={()=>{goto("/Users")}}>
            <span class="back-icon">←</span>
            <span class="back-text">Voltar ao Perfil</span>
        </button>
        <button class="back-btn hover:bg-amber-950" on:click={()=>{goto("Investimentos/Mercado")}}>
            <span class="back-text">Mercado</span>
            <span class="back-icon">→</span>
        </button>
    </div>

    <div class="page-header relative" class:visible={true}>
        <div class="header-top">
        </div>
        <h1 class="page-title">Dashboard de Investimentos</h1>
        <p class="page-subtitle">Acompanhe o desempenho da sua conta</p>
    </div>
    
    <!-- Cards de estatísticas -->
    <div class="stats-grid" class:visible={true}>
        <div class="stat-card">
            <div class="stat-icon"><i class="fa-solid fa-sack-dollar text-white"></i></div>
            <div class="stat-content">
                <h3>Valor Total</h3>
                <p class="stat-value">{Number(json?.data?.data?.Valor)} KGB</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon"><i class="fa-solid fa-money-bill-wheat text-white"></i></div>
            <div class="stat-content">
                <h3>Valor médio do metro</h3>
                <p class="stat-value">{InfromacoesGeraisMeusInvestimentos.valormetromedio} KGB</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon"><i class="fa-solid fa-expand text-white"></i></div>
            <div class="stat-content">
                <h3>área total obtida</h3>
                <p class="stat-value">{Number(InfromacoesGeraisMeusInvestimentos.AreaTotal)}m²</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon"><i class="fa-solid fa-maximize text-white"></i></div>
            <div class="stat-content">
                <h3>area média</h3>
                <p class="stat-value">{Number(InfromacoesGeraisMeusInvestimentos.AreaMedia)}m²</p>
            </div>
        </div>
    </div>

    <!-- Grid de gráficos -->
    <div class="charts-grid" class:visible={true}>
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
            <div class="chart-content flex flex-row items-center">
                <Pie/>
            </div>
            {#if showPieSummary}
                <div class="summary-modal">
                    <div class="summary-content">
                        <h4>{getPieSummary(Number(json?.data?.data?.Valor),json.data.data.Saldo).title}</h4>
                        <p>{getPieSummary(Number(json?.data?.data?.Valor),json.data.data.Saldo).summary}</p>
                        <button class="close-btn" on:click={() => showPieSummary = false}>✕</button>
                    </div>
                </div>
            {/if}
        </div>

        

        <!-- Gráfico de Barras -->
        <div class="chart-container bar-chart">
            <div class="chart-header">
                <h3>Valor das melhores ações</h3>
                <div class="chart-actions">
                    <button class="action-btn">📊</button>
                    <button class="action-btn eye-btn" on:click={() => showBarSummary = !showBarSummary}>
                        {showBarSummary ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
            </div>
            <div class="chart-content">
                <Bar/>
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


    </div>

    <div class="wrap mt-[20px] w-full" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
        {#each MeusInvestimentos as MeuInvestimento}
            <div class="min-w-md max-w-lg bg-sky-900 flex flex-col gap-[20px] border border-default rounded-3xl shadow-xs">
                <img class="w-full rounded-t-3xl h-[200px]" src="data:image/jpeg;base64,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" alt="" />
                <div class="px-8">
                    <div class="flex flex-row my-10 text-xl" style="justify-content: space-around;">
                        <p class="text-white "><i class="fa-solid fa-mug-hot pe-2"></i>{MeuInvestimento.Nome} </p>
                        <p class="text-white"><i class="fa-solid fa-expand pe-2"></i>{MeuInvestimento.AreaPossuida}m²</p>  
                    </div>
                    <div class="flex flex-col w-full" style="justify-content: start;">
                        <div class="text-white text-xl flex flex-col" style="justify-items: center; gap:20px;">
                            <span><i class="fa-solid fa-money-bill-1"></i> {MeuInvestimento?.AreaPossuida*MeuInvestimento?.ValorMetro} KGB totais</span>
                            <span><i class="fa-solid fa-cash-register"></i> {MeuInvestimento?.PrecoUnitario} KGB a unidade</span>
                            <span class="mb-5"><i class="fa-solid fa-maximize"></i> {MeuInvestimento?.ValorMetro} KGB/m²</span>
                        </div>
                    </div>
                </div>
                <a href="/Users/Investimentos/Mercado/Compra/{MeuInvestimento.id}">
                    <div class="mx-auto rounded-full bg-[#240f00] mb-5" style="width: max-content;">
                        <button class="chart-container w-sm text-3xl text-[#fff] hover:cursor-pointer" style="padding: 10px; border-radius: calc(infinity * 1px);">COMPRAR MAIS AÇÕES</button>
                    </div>
                </a>
                </div>
        {/each}
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
        position: relative;
        overflow: hidden;
    }

    .investments-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(67, 206, 162, 0.05) 0%, transparent 50%);
        pointer-events: none;
        z-index: -1;
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
        position: relative;
    }

    .page-header.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .header-top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        margin-bottom: 2rem;
    }

    .back-btn {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(102, 126, 234, 0.3);
        border-radius: 12px;
        padding: 0.75rem 1.5rem;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        font-weight: 500;
        position: relative;
        overflow: hidden;
    }

    .back-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        transition: left 0.5s ease;
    }

    .back-btn:hover {
        transform: translateX(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        border-color: rgba(102, 126, 234, 0.5);
    }

    .back-btn:hover::before {
        left: 100%;
    }

    .back-icon {
        font-size: 1.1rem;
        transition: transform 0.2s ease;
    }

    .back-btn:hover .back-icon {
        transform: translateX(-2px);
    }

    .back-text {
        transition: color 0.2s ease;
    }

    .back-btn:hover .back-text {
        color: rgba(102, 126, 234, 1);
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
        position: relative;
        animation: titleGlow 3s ease-in-out infinite alternate;
    }

    @keyframes titleGlow {
        0% {
            filter: brightness(1);
        }
        100% {
            filter: brightness(1.1);
        }
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
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
        animation: pulse 0.6s ease-in-out;
    }

    @keyframes pulse {
        0% { transform: scale(1.1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1.1); }
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

        .back-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }

        .back-text {
            display: none;
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