<script lang="ts">
	import axios from "axios";
	import LinkButton from "../../../Components/cards/userMainlinknavigacion.svelte"
    import { onMount } from "svelte";
    import logo from "../../../assets/images/coffebank_noir-removebg-preview.png";
	
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
	let data: {id: number, Compra: number, Preco: number, AreaTotal: string, Nome: string, DonodoInvestimento: string}[] = []
	let erros: string[] = []
	let loading = true
	
    onMount(async() => {
        token = sessionStorage.getItem("auth_token");
        if (token) {
            payload = atob(token.split(".")[1]);
            user = JSON.parse(payload);
        }
		
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

							<!-- Action Button -->
							<button class="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
