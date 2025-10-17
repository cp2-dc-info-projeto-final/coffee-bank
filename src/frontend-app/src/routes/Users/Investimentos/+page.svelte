<script lang="ts">
	import axios from "axios";
	import LinkButton from "../../../Components/cards/userMainlinknavigacion.svelte"
    import { onMount } from "svelte";
    import logo from "../../../assets/images/coffebank_noir-removebg-preview.png";
	import { onDestroy } from 'svelte';
	
	type MarketItem = { id: number, Compra: number, Preco: number, AreaTotal: string, Nome: string, DonodoInvestimento: string }
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
	let data: MarketItem[] = []
	let erros: string[] = []
	let loading = true

	// Modal state
	let showModal = false
	let selected: MarketItem | null = null
	let detail: BackendDetail | null = null
	let detailLoading = false
	let detailError: string | null = null

	async function openDetails(investimento: MarketItem) {
		showModal = true
		selected = investimento
		detailLoading = true
		detailError = null
		detail = null
		try {
			// Buscar detalhes pelo nome do proprietário (DonodoInvestimento) e filtrar pelo nome do fundo
			const resp = await api.put('/investment/Namesearch', { Name: investimento.DonodoInvestimento })
			if (resp.status === 200 && resp.data?.Data?.length) {
				const match = resp.data.Data.find((it: BackendDetail) => it.Nome === investimento.Nome)
				if (match) {
					detail = match
				} else {
					detailError = 'Fundo não encontrado para este proprietário.'
				}
			} else {
				detailError = 'Detalhes não encontrados.'
			}
		} catch (e) {
			detailError = 'Erro ao buscar detalhes do fundo.'
		} finally {
			detailLoading = false
		}
	}

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

		window.addEventListener('keydown', handleKeydown)
		
		try {
			const resultado = await api.get("/mercado")
			if(resultado.status == 200){
				data = resultado.data.Data
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
<div class="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/20 to-gray-800">
	<!-- Header -->
	<header class="relative w-full">
		<div class="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1733342660123-10ab1ece90cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10 z-0"></div>
		<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
			<div class="flex flex-row justify-center items-center gap-1">
				<img src={logo} alt="Coffee Bank" class="h-10 w-10 md:h-12 md:w-12" />
				<div class="hidden sm:inline text-3xl text-white font-bold">Coffebank</div>
			</div>
			<nav class="flex items-center gap-2 md:gap-3">
				<a href={links.userPage} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
					<i class="fa-solid fa-home"></i>
					<span class="hidden sm:inline">Dashboard</span>
				</a>
				<a href={links.login} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
					<i class="fa-solid fa-right-to-bracket"></i>
					<span class="hidden sm:inline">Entrar</span>
				</a>
				<a href={links.cadastro} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
					<i class="fa-solid fa-user-plus"></i>
					<span class="hidden sm:inline">Criar conta</span>
				</a>
			</nav>
		</div>
	</header>

	<!-- Main Content -->
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
		<!-- Hero Section -->
		<div class="text-center mb-12 animate-fade-in-up">
			<h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4">
				Mercado de Investimentos
			</h1>
			<p class="text-xl text-amber-200/80 max-w-3xl mx-auto">
				Descubra oportunidades de investimento exclusivas e diversifique seu portfólio com segurança
			</p>
		</div>

		<!-- Stats Section -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
			<div class="bg-gradient-to-br from-amber-600/20 to-amber-800/20 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 animate-fade-in-up hover:scale-105 transition-all duration-300">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-amber-200/70 text-sm font-medium">Total de Oportunidades</p>
						<p class="text-3xl font-bold text-white">{data.length}</p>
					</div>
					<i class="fa-solid fa-chart-line text-3xl text-amber-400"></i>
				</div>
			</div>
			
			<div class="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 animate-fade-in-up hover:scale-105 transition-all duration-300" style="animation-delay: 0.1s;">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-green-200/70 text-sm font-medium">Valor Médio</p>
						<p class="text-3xl font-bold text-white">
							{data.length > 0 ? Math.round(data.reduce((acc, item) => acc + item.Preco, 0) / data.length) : 0} KGB
						</p>
					</div>
					<i class="fa-solid fa-coins text-3xl text-green-400"></i>
				</div>
			</div>
			
			<div class="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 animate-fade-in-up hover:scale-105 transition-all duration-300" style="animation-delay: 0.2s;">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-blue-200/70 text-sm font-medium">Diversificação</p>
						<p class="text-3xl font-bold text-white">Alta</p>
					</div>
					<i class="fa-solid fa-shield-halved text-3xl text-blue-400"></i>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="flex justify-center items-center py-20">
				<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
			</div>
		{:else if erros.length > 0}
			<!-- Error State -->
			<div class="bg-red-600/20 backdrop-blur-sm rounded-xl p-8 border border-red-500/30 text-center">
				<i class="fa-solid fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
				<h3 class="text-xl font-semibold text-white mb-2">Erro ao carregar investimentos</h3>
				<p class="text-red-200/80">{erros[0]}</p>
			</div>
		{:else if data.length === 0}
			<!-- Empty State -->
			<div class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-600/30 text-center">
				<i class="fa-solid fa-chart-line text-6xl text-gray-400 mb-6"></i>
				<h3 class="text-2xl font-semibold text-white mb-4">Nenhum investimento disponível</h3>
				<p class="text-gray-300/80">Novas oportunidades serão adicionadas em breve.</p>
			</div>
		{:else}
			<!-- Investments Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data as investimento, index}
					<div class="investment-card animate-fade-in-up" style="animation-delay: {index * 0.1}s;">
						<div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
							<!-- Investment Header -->
							<div class="flex items-start justify-between mb-4">
								<div class="flex-1">
									<h3 class="text-xl font-bold text-white mb-2 line-clamp-2">
										{investimento.Nome}
									</h3>
									<p class="text-amber-200/70 text-sm">
										<i class="fa-solid fa-user mr-2"></i>
										{investimento.DonodoInvestimento}
									</p>
								</div>
								<div class="ml-4">
									<div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
										<i class="fa-solid fa-chart-line text-white text-lg"></i>
									</div>
								</div>
							</div>

							<!-- Investment Details -->
							<div class="space-y-3 mb-6">
								<div class="flex justify-between items-center">
									<span class="text-gray-300 text-sm">Preço</span>
									<span class="text-2xl font-bold text-amber-400">{investimento.Preco} KGB</span>
								</div>
								
								{#if investimento.AreaTotal}
									<div class="flex justify-between items-center">
										<span class="text-gray-300 text-sm">Área Total</span>
										<span class="text-white font-medium">{investimento.AreaTotal}</span>
									</div>
								{/if}
								
								{#if investimento.Compra}
									<div class="flex justify-between items-center">
										<span class="text-gray-300 text-sm">Valor de Compra</span>
										<span class="text-white font-medium">{investimento.Compra} KGB</span>
									</div>
								{/if}
							</div>

				
						<button on:click={() => openDetails(investimento)} class="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
								<i class="fa-solid fa-eye mr-2"></i>
								Ver Detalhes
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

{#if showModal && selected}
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
		on:click={(e) => { if (e.target === e.currentTarget) closeModal() }}
		role="button"
		aria-label="Fechar detalhes"
		tabindex="0"
		on:keydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') closeModal() }}
	>
		<div class="relative z-50 w-full max-w-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-xl p-6 shadow-2xl">
			<div class="flex items-start justify-between mb-4">
				<h2 class="text-2xl font-bold text-white">{selected.Nome}</h2>
				<button aria-label="Fechar" class="text-white/70 hover:text-white" on:click={closeModal}>
					<i class="fa-solid fa-xmark text-2xl"></i>
				</button>
			</div>

			{#if detailLoading}
				<div class="py-10 flex items-center justify-center">
					<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
				</div>
			{:else if detailError}
				<div class="bg-red-600/20 rounded-lg p-4 border border-red-500/30 text-red-200">
					{detailError}
				</div>
			{:else if detail}
				<div class="space-y-4">
					<div class="flex items-center gap-2 text-amber-200/80">
						<i class="fa-solid fa-user"></i>
						<span class="font-medium">Proprietário:</span>
						<span class="text-white">{detail.DonodoInvestimento}</span>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div class="bg-white/5 rounded-lg p-4 border border-white/10">
							<p class="text-gray-300 text-sm">Preço</p>
							<p class="text-2xl font-bold text-amber-400">{detail.Preco} KGB</p>
						</div>
						<div class="bg-white/5 rounded-lg p-4 border border-white/10">
							<p class="text-gray-300 text-sm">Porcentagem</p>
							<p class="text-xl font-semibold text-white">{detail.Porcentagem}%</p>
						</div>
						<div class="bg-white/5 rounded-lg p-4 border border-white/10">
							<p class="text-gray-300 text-sm">Área Total</p>
							<p class="text-white font-medium">{detail.Tamanho}</p>
						</div>
						<div class="bg-white/5 rounded-lg p-4 border border-white/10">
							<p class="text-gray-300 text-sm">Área Vendida</p>
							<p class="text-white font-medium">{detail.AreaVendida}</p>
						</div>
						<div class="bg-white/5 rounded-lg p-4 border border-white/10 sm:col-span-2">
							<p class="text-gray-300 text-sm">Distrito Federal</p>
							<p class="text-white font-medium">{detail.DF}</p>
						</div>
					</div>
				</div>
			{/if}

			<div class="mt-6 flex justify-end gap-3">
				<button class="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition" on:click={closeModal}>Fechar</button>
				<button class="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 text-white hover:from-amber-700 hover:to-amber-900 transition" type="button">
					<i class="fa-solid fa-cart-shopping mr-2"></i>
					Investir
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Animations */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.animate-fade-in-up {
		animation: fadeInUp 0.6s ease-out forwards;
		opacity: 0;
	}
	
	.investment-card {
		position: relative;
		overflow: hidden;
	}
	
	.investment-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
		transition: left 0.5s;
	}
	
	.investment-card:hover::before {
		left: 100%;
	}
	
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
