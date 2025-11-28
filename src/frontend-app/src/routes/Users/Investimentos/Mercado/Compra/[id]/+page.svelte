<script lang="ts">
	import Textform from './../../../../../../Components/textform.svelte';
	import axios from "axios";
	import LinkButton from "../../../../../../Components/cards/userMainlinknavigacion.svelte"
    import { onMount } from "svelte";
    import logo from "../../../../../../assets/images/coffebank_noir-removebg-preview.png";
    import BG from "../../../../../../assets/images/tipos-de-cafe.jpg"
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { get } from "svelte/store";
    import Nav from "../../../../../../Components/Navs/UserLogin.svelte"
    import Pie from '$lib/components/Graphic/InvestmentBuy/Pie.svelte';
    
    var modal=false
	const { id } = get(page).params;
	console.log(id)
	type Investment = { id: number, Compra: number, Preco: number, AreaTotal: string, Nome: string, DonodoInvestimento: string }
	type BackendDetail = { DonodoInvestimento: string, Preco: number, Tamanho: number, Numero: number, AreaVendida: number, Porcentagem: number, Nome: string, DF: string }

	// Links principais
	const api = axios.create({
		baseURL: 'http://localhost:3000',
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
	})
	
	const links = {
		login: "/LoginUser",
		cadastro: "/Cadastro",
		termos: "/Cadastro/termos",
		userPage: "/Users"
	};
	
    let token
    let payload
    let user = {}
	let data: Investment[] = []
	let erros: string[] = []
	let loading = true
	let isLoggedIn = false

	// Modal state
	let showModal = false
	let selected: Investment | null = null
	let detail: BackendDetail | null = null
	let detailLoading = false
	let detailError: string | null = null


	function closeModal() {
		showModal = false
		selected = null
		detail = null
		detailError = null
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showModal) {
			closeModal()
		}
	}
	
    onMount(async() => {
        token = sessionStorage.getItem("auth_token");
        if (token) {
            payload = atob(token.split(".")[1]);
            user = JSON.parse(payload);
        }

		// Atualiza flag de login
		isLoggedIn = !!token

		window.addEventListener('keydown', handleKeydown)
		
		try {
			const resultado = await api.get(`/mercado/${id}`)
			if(resultado.status == 200){
				data = resultado.data.Data[0]
				console.log(data)
			} else {
				erros.push("Problema na consulta")
			}
		} catch (error) {
			erros.push("Erro ao carregar investimentos")
		} finally {
			loading = false
		}
    })  
	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown)
	})
</script>
<sveltehead> Fundo Imobiliário</sveltehead>
<div class="absolute w-full">
	<Nav/>
</div>`
<div class="flex flex-1 mt-12 sm:mt-16 " style="background-image: url({BG}); backgroundSize: 'cover';">
    <div class="flex flex-1 bg-black/60 backdrop-blur">
    <div class="w-full flex mt-[200px] flex-col lg:flex-row  justify-evenly lg:items-center px-7 ">
        <div class="lg:w-[800px] bg-neutral-primary-soft block rounded-base shadow-xs text-center">
            <div class="w-[75%] justify-center items-center mx-auto transition-all duration-300 hover:-translate-y-1 hover:shadow">
                <Pie id={id} />
            </div>
        </div>
        <div class="flex flex-col">
            <div class="animate-fade-in-up text-white mb-40 ">
                <div class="p-6 text-center">
                    <h5 class="mt-3 mb-6 text-6xl font-semibold tracking-tight text-heading transition-all duration-300 hover:-translate-y-1 hover:shadow ">{data.Nome}</h5>
                
                </div>
                <div class="flex flex-col w-full">
                    <span class="text-center text-xl font-medium py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow">
                        <i class="fa-solid fa-user-tie px-5"></i>
                        {data.DonodoInvestimento}
                    </span>
                    <span class="text-xl font-medium py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow">
                        <i class="fa-solid fa-earth-americas px-5 "></i>
                        Fazenda em {data.DF}
                    </span>
                    <span class="text-xl font-medium py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow">
                        <i class="fa-solid fa-maximize px-5"></i>
                        {data.AreaVendida}m² à venda
                    </span>
                </div>
            </div>
            <div class=" text-gray-900 dark:text-white mb-5 w-full">
                        <button class="mx-auto w-full lg:max-w-md py-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 text-white hover:from-amber-700 hover:to-amber-900 transition text-6xl lg:text-7xl transition-all duration-300 hover:-translate-y-1 hover:shadow" type="button" on:click={()=>{modal=true}} >
                            <i class="fa-solid fa-cart-shopping mr-2"></i>
                            {data.Preco} KGB
                        </button>
                        <div class="mt-8">
                            <a href="/Users/Investimentos/Mercado" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
                                <i class="fa-solid fa-arrow-left"></i>   
                                <span>Voltar ao Mercado</span>
                            </a>
                        </div>
                </div>
        </div>
        </div>
    </div>
</div>
{#if modal}
    <div class="absolute w-full h-full flex bg-[#ffffff2b] backdrop-blur-3xl" style="z-index: 2;">
        <button class="absolute right-10 top-10 text-5xl text-white hover:cursor-pointer" on:click={()=>{modal=false}}>X</button>
        <div class="absolute w-100 h-100 bg-amber-950 top-[50%] left-[calc(50%-540px)] rounded-l-full" style="transform: translate(-25%, -90%); mask: radial-gradient(circle 90px at center, transparent 0 90px, black 41px);"></div>
        <div class="absolute w-200 h-200 bg-amber-950 top-[50%] left-[50%] rounded-b-full rounded-t-4xl flex flex-col m-5" style="transform: translate(-50%, -50%);">
            
            <div class="flex flex-row m-5 w-full" style="z-index: 1;">
                <Textform 
                Content="senha7"
                Name="senha7"
                id="senha7"
                color="amber-900"/>
                
            </div>
            <div class="flex flex-row m-5 w-full" style="z-index: 1;">
                <Textform 
                Content="Numero"
                Name="Numero"
                id="Numero"
                color="amber-900"/>
                
            </div>

        </div>
       
    </div>
{/if}

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