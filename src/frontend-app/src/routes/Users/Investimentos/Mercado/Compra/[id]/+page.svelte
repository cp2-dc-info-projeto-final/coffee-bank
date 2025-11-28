<script lang="ts">
	import axios from "axios";
	import { onMount } from "svelte";
	import logo from "../../../../../../assets/images/coffebank_noir-removebg-preview.png";
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { get } from "svelte/store";
	import { goto } from '$app/navigation';
	import Pie from '$lib/components/Graphic/InvestmentBuy/Pie.svelte';

	const { id } = get(page).params;

	type Investment = {
		id: number,
		Compra: number,
		Preco: number,
		AreaTotal: string,
		Nome: string,
		DonodoInvestimento: string,
		DF: string,
		AreaVendida: number,
		Porcentagem: number
	}

	// Links principais
	let login = null;
    if (typeof window !== 'undefined') {
    login = sessionStorage.getItem("auth_token");
    }

    const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Barre: ${login}`
    },
    });

	const links = {
		login: "/LoginUser",
		cadastro: "/Cadastro",
		termos: "/Cadastro/termos",
		userPage: "/Users",
		mercado: "/Users/Investimentos/Mercado"
	};

	let token: string | null = null;
	let payload: string;
	let user: any = {};
	let data: Investment;
	let erros: string[] = [];
	let loading = true;
	let isLoggedIn = false;

	// Modal de confirmação
	let showConfirmModal = false;
	let confirmPassword = '';
	let confirmLoading = false;
	let confirmError = '';

	// Estados para compra
	let compraSuccess = false;
	let compraError = '';

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showConfirmModal) {
			closeConfirmModal();
		}
	}

	async function loadInvestment() {
		try {
			loading = true;
			const resultado = await api.get(`/mercado/${id}`);
			if (resultado.status == 200) {
				data = resultado.data.Data[0];
				console.log(data);
			} else {
				erros.push("Problema na consulta");
			}
		} catch (error) {
			erros.push("Erro ao carregar investimento");
		} finally {
			loading = false;
		}
	}

	function openConfirmModal() {
		showConfirmModal = true;
		confirmPassword = '';
		confirmError = '';
	}

	function closeConfirmModal() {
		showConfirmModal = false;
		confirmPassword = '';
		confirmError = '';
	}

	async function confirmarCompra() {
		if (!confirmPassword || confirmPassword.length !== 7) {
			confirmError = 'A senha deve ter exatamente 7 dígitos';
			return;
		}

		try {
			confirmLoading = true;
			confirmError = '';

			const compraData = {
				ChavePix: user.CPF,
				senha7: confirmPassword,
				Numero: 1 // Quantidade padrão
			};

			const response = await api.put(`/mercado/compraInvestimento/${id}`, compraData);

			if (response.status === 200) {
				compraSuccess = true;
				closeConfirmModal();
				// Redirecionar após alguns segundos
				setTimeout(() => {
					goto('/Users');
				}, 3000);
			} else {
				confirmError = response.data.message || 'Erro na compra';
			}
		} catch (error: any) {
			console.error('Erro na compra:', error);
			confirmError = error.response?.data?.message || 'Erro ao processar compra';
		} finally {
			confirmLoading = false;
		}
	}

	onMount(async() => {
		token = sessionStorage.getItem("auth_token");
		if (token) {
			payload = atob(token.split(".")[1]);
			user = JSON.parse(payload);
		}

		isLoggedIn = !!token;
		window.addEventListener('keydown', handleKeydown);

		await loadInvestment();
	})

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	})
</script>
<svelte:head>
	<title>{data?.Nome || 'Compra de Investimento'} - Coffee Bank</title>
</svelte:head>

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
				{#if !isLoggedIn}
					<a href={links.login} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
						<i class="fa-solid fa-right-to-bracket"></i>
						<span class="hidden sm:inline">Entrar</span>
					</a>
					<a href={links.cadastro} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
						<i class="fa-solid fa-user-plus"></i>
						<span class="hidden sm:inline">Criar conta</span>
					</a>
				{/if}
			</nav>
		</div>
	</header>

	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
		<!-- Breadcrumb -->
		<div class="mb-8 animate-fade-in-up">
			<a href={links.mercado} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
				<i class="fa-solid fa-arrow-left"></i>
				<span>Voltar ao Mercado</span>
			</a>
		</div>

		{#if loading}
			<div class="flex justify-center items-center py-20">
				<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
			</div>
		{:else if erros.length > 0}
			<!-- Error State -->
			<div class="bg-red-600/20 backdrop-blur-sm rounded-xl p-8 border border-red-500/30 text-center">
				<i class="fa-solid fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
				<h3 class="text-xl font-semibold text-white mb-2">Erro ao carregar investimento</h3>
				<p class="text-red-200/80">{erros[0]}</p>
			</div>
		{:else if data}
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
				<!-- Investment Chart -->
				<div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-amber-500/50 transition-all duration-300">
					<div class="text-center mb-6">
						<h3 class="text-2xl font-bold text-white mb-2">Distribuição do Investimento</h3>
						<p class="text-amber-200/70">Visualização gráfica da participação</p>
					</div>
					<div class="w-full max-w-md mx-auto">
						<Pie id={id} />
					</div>
				</div>

				<!-- Investment Details -->
				<div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-amber-500/50 transition-all duration-300">
					<div class="text-center mb-8">
						<h2 class="text-4xl font-extrabold text-white mb-4">{data.Nome}</h2>
						<div class="w-20 h-1 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto rounded-full"></div>
					</div>

					<div class="space-y-6">
						<!-- Owner Info -->
						<div class="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
							<div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
								<i class="fa-solid fa-user-tie text-white"></i>
							</div>
							<div>
								<p class="text-amber-200/70 text-sm">Proprietário</p>
								<p class="text-white font-semibold">{data.DonodoInvestimento}</p>
							</div>
						</div>

						<!-- Location Info -->
						<div class="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
							<div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
								<i class="fa-solid fa-map-marker-alt text-white"></i>
							</div>
							<div>
								<p class="text-green-200/70 text-sm">Localização</p>
								<p class="text-white font-semibold">Fazenda em {data.DF}</p>
							</div>
						</div>

						<!-- Area Info -->
						<div class="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
							<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
								<i class="fa-solid fa-maximize text-white"></i>
							</div>
							<div>
								<p class="text-blue-200/70 text-sm">Área Disponível</p>
								<p class="text-white font-semibold">{data.AreaVendida}m² à venda</p>
							</div>
						</div>

						<!-- Price Info -->
						<div class="bg-gradient-to-r from-amber-600/20 to-amber-800/20 rounded-xl p-6 border border-amber-500/30">
							<div class="text-center">
								<p class="text-amber-200/70 text-sm mb-2">Preço por Unidade</p>
								<p class="text-4xl font-bold text-amber-400 mb-4">{data.Preco} KGB</p>
								<p class="text-gray-300 text-sm">Quantidade: 1 unidade</p>
							</div>
						</div>
					</div>

					<!-- Buy Button -->
					<div class="mt-8">
						<button
							on:click={openConfirmModal}
							class="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
						>
							<i class="fa-solid fa-cart-shopping text-xl"></i>
							<span class="text-lg">Comprar Investimento</span>
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Success Modal -->
{#if compraSuccess}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
		<div class="bg-gradient-to-br from-green-600/90 to-green-800/90 backdrop-blur-sm rounded-xl p-8 border border-green-500/30 shadow-2xl max-w-md w-full animate-fade-in-up">
			<div class="text-center">
				<div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
					<i class="fa-solid fa-check text-white text-2xl"></i>
				</div>
				<h3 class="text-2xl font-bold text-white mb-4">Compra Realizada!</h3>
				<p class="text-green-100 mb-6">Seu investimento foi processado com sucesso.</p>
				<p class="text-sm text-green-200">Redirecionando para o dashboard...</p>
			</div>
		</div>
	</div>
{/if}

<!-- Confirmation Modal -->
{#if showConfirmModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
		<!-- Decorative Coffee Cup -->
		<div class="coffee-cup-decoration">
			<div class="steam"></div>
			<div class="steam"></div>
			<div class="steam"></div>
			<div class="handle"></div>
			<div class="coffee"></div>
			<div class="froth"></div>
		</div>

		<div class="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm rounded-xl p-8 border border-amber-500/30 shadow-2xl max-w-md w-full animate-fade-in-up relative z-10">
			<div class="flex items-start justify-between mb-6">
				<h2 class="text-2xl font-bold text-white">Confirmar Compra</h2>
				<button
					on:click={closeConfirmModal}
					class="text-white/70 hover:text-white transition-colors"
					aria-label="Fechar"
				>
					<i class="fa-solid fa-xmark text-xl"></i>
				</button>
			</div>

			<div class="space-y-6">
				<!-- Investment Summary -->
				<div class="bg-white/5 rounded-lg p-4 border border-white/10">
					<h4 class="text-amber-400 font-semibold mb-3">Resumo da Compra</h4>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-300">Investimento:</span>
							<span class="text-white font-medium">{data?.Nome}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-300">Quantidade:</span>
							<span class="text-white font-medium">1 unidade</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-300">Valor:</span>
							<span class="text-amber-400 font-bold">{data?.Preco} KGB</span>
						</div>
					</div>
				</div>

				<!-- Password Input -->
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
						Senha de 7 dígitos
					</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						maxlength="7"
						class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
						placeholder="Digite sua senha de 7 dígitos"
						required
					/>
					{#if confirmError}
						<p class="mt-2 text-sm text-red-400">{confirmError}</p>
					{/if}
				</div>

				<!-- Action Buttons -->
				<div class="flex gap-3">
					<button
						on:click={closeConfirmModal}
						class="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
					>
						Cancelar
					</button>
					<button
						on:click={confirmarCompra}
						disabled={confirmLoading}
						class="flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
					>
						{#if confirmLoading}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							Processando...
						{:else}
							<i class="fa-solid fa-check"></i>
							Confirmar Compra
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.6s ease-out;
	}

	.coffee-cup-decoration {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 200px;
		height: 200px;
		animation: float 6s ease-in-out infinite;
		z-index: 1;
	}

	.coffee-cup-decoration::before {
		content: '';
		position: absolute;
		top: 40px;
		left: 70px;
		width: 60px;
		height: 80px;
		background: linear-gradient(145deg, #8B4513, #A0522D);
		border-radius: 0 0 40px 40px;
		box-shadow:
			inset -5px 0 10px rgba(0,0,0,0.3),
			inset 5px 0 10px rgba(255,255,255,0.1),
			0 4px 15px rgba(0,0,0,0.3);
	}

	.coffee-cup-decoration::after {
		content: '';
		position: absolute;
		top: 35px;
		left: 75px;
		width: 50px;
		height: 8px;
		background: linear-gradient(90deg, #D2B48C, #F5DEB3);
		border-radius: 50%;
		box-shadow:
			inset 0 2px 4px rgba(0,0,0,0.2),
			0 2px 8px rgba(0,0,0,0.1);
		animation: steam 3s ease-in-out infinite;
	}

	/* Coffee steam */
	.coffee-cup-decoration .steam {
		position: absolute;
		top: 25px;
		left: 85px;
		width: 30px;
		height: 15px;
		background: rgba(255,255,255,0.6);
		border-radius: 50%;
		animation: steam 4s ease-in-out infinite;
	}

	.coffee-cup-decoration .steam:nth-child(2) {
		left: 95px;
		animation-delay: 0.5s;
		animation-duration: 3.5s;
	}

	.coffee-cup-decoration .steam:nth-child(3) {
		left: 105px;
		animation-delay: 1s;
		animation-duration: 4.5s;
	}

	/* Handle of the cup */
	.coffee-cup-decoration .handle {
		position: absolute;
		top: 60px;
		left: 120px;
		width: 20px;
		height: 30px;
		border: 3px solid #8B4513;
		border-left: none;
		border-radius: 0 50px 50px 0;
		background: linear-gradient(145deg, #A0522D, #8B4513);
		box-shadow: inset 2px 0 5px rgba(0,0,0,0.3);
	}

	/* Coffee inside the cup */
	.coffee-cup-decoration .coffee {
		position: absolute;
		top: 50px;
		left: 80px;
		width: 40px;
		height: 60px;
		background: linear-gradient(180deg, #3E2723, #5D4037);
		border-radius: 0 0 30px 30px;
		box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
	}

	/* Coffee froth */
	.coffee-cup-decoration .froth {
		position: absolute;
		top: 48px;
		left: 82px;
		width: 36px;
		height: 8px;
		background: linear-gradient(90deg, #D7CCC8, #BCAAA4);
		border-radius: 50%;
		box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);
	}

	@keyframes float {
		0%, 100% {
			transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
		}
		25% {
			transform: translate(-50%, -50%) translateY(-5px) rotate(1deg);
		}
		50% {
			transform: translate(-50%, -50%) translateY(-10px) rotate(0deg);
		}
		75% {
			transform: translate(-50%, -50%) translateY(-5px) rotate(-1deg);
		}
	}

	@keyframes steam {
		0%, 100% {
			opacity: 0;
			transform: translateY(0px) scale(0.8);
		}
		50% {
			opacity: 0.7;
			transform: translateY(-15px) scale(1.2);
		}
	}

	/* Add the decorative elements */
	.coffee-cup-decoration .steam,
	.coffee-cup-decoration .handle,
	.coffee-cup-decoration .coffee,
	.coffee-cup-decoration .froth {
		content: '';
		position: absolute;
	}
</style>
