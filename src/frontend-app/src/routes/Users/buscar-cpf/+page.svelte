<script lang="ts">
	import { onMount } from 'svelte';
	import logo from "../../../assets/images/coffebank_noir-removebg-preview.png";

	let searchTerm = '';
	let searchResults: any[] = [];
	let isLoading = false;
	let errorMessage = '';
	let successMessage = '';

	// Função para formatar CPF
	function formatCPF(cpf: string): string {
		return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}

	// Função para buscar CPF
	async function searchCPF() {
		if (!searchTerm.trim()) {
			errorMessage = 'Por favor, digite um CPF para buscar';
			return;
		}

		// Remove formatação do CPF para busca
		const cleanCPF = searchTerm.replace(/\D/g, '');
		
		if (cleanCPF.length < 3) {
			errorMessage = 'Digite pelo menos 3 dígitos para buscar';
			return;
		}

		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const response = await fetch('/api/users/searchCPF', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ CPF: cleanCPF })
			});

			const data = await response.json();

			if (data.success) {
				searchResults = data.data;
				successMessage = `${data.data.length} usuário(s) encontrado(s)`;
			} else {
				errorMessage = data.message || 'Nenhum usuário encontrado';
				searchResults = [];
			}
		} catch (error) {
			console.error('Erro na busca:', error);
			errorMessage = 'Erro ao buscar usuários. Tente novamente.';
			searchResults = [];
		} finally {
			isLoading = false;
		}
	}

	// Função para limpar busca
	function clearSearch() {
		searchTerm = '';
		searchResults = [];
		errorMessage = '';
		successMessage = '';
	}

	// Função para copiar CPF
	async function copyCPF(cpf: string) {
		try {
			await navigator.clipboard.writeText(cpf);
			successMessage = 'CPF copiado para a área de transferência!';
			setTimeout(() => successMessage = '', 3000);
		} catch (error) {
			console.error('Erro ao copiar:', error);
		}
	}

	// Função para buscar por Enter
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchCPF();
		}
	}
</script>

<!-- Header -->
<header class="relative w-full">
	<div class="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1733342660123-10ab1ece90cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10 z-0"></div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
		<div class="flex flex-row justify-center items-center gap-1">
			<img src={logo} alt="Coffee Bank" class="h-10 w-10 md:h-12 md:w-12" />
			<div class="hidden sm:inline text-3xl text-white">Coffebank</div>
		</div>
		<nav class="flex items-center gap-2 md:gap-3">
			<a href="/Users" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
				<i class="fa-solid fa-arrow-left"></i>
				<span class="hidden sm:inline">Voltar</span>
			</a>
		</nav>
	</div>
</header>

<!-- Main Content -->
<section class="relative overflow-hidden min-h-screen">
	<div class="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-rose-500/20 to-amber-900/30"></div>
	<div class="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
		
		<!-- Título e Descrição -->
		<div class="text-center mb-12 animate-fade-in-up">
			<h1 class="text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-sm">
				Buscar Usuários por CPF
			</h1>
			<p class="mt-4 text-amber-200/70 md:text-lg max-w-2xl mx-auto">
				Encontre usuários cadastrados no sistema digitando o CPF ou parte dele
			</p>
		</div>

		<!-- Formulário de Busca -->
		<div class="max-w-2xl mx-auto mb-8">
			<div class="rounded-2xl border border-amber-200/70 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 backdrop-blur p-6 md:p-8 shadow-lg feature-card-animated">
				<div class="space-y-4">
					<div>
						<label for="cpf-search" class="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
							CPF do Usuário
						</label>
						<div class="relative">
							<input
								id="cpf-search"
								type="text"
								bind:value={searchTerm}
								on:keypress={handleKeyPress}
								placeholder="Digite o CPF (apenas números ou com formatação)"
								class="w-full px-4 py-3 rounded-xl border border-amber-300/70 dark:border-amber-700/70 bg-white/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 placeholder-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
								disabled={isLoading}
							/>
							<i class="fa-solid fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500/70"></i>
						</div>
					</div>
					
					<div class="flex flex-col sm:flex-row gap-3">
						<button
							on:click={searchCPF}
							disabled={isLoading || !searchTerm.trim()}
							class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow hover:shadow-lg hover:-translate-y-0.5"
						>
							{#if isLoading}
								<i class="fa-solid fa-spinner fa-spin"></i>
								<span>Buscando...</span>
							{:else}
								<i class="fa-solid fa-search"></i>
								<span>Buscar Usuários</span>
							{/if}
						</button>
						
						{#if searchResults.length > 0 || errorMessage}
							<button
								on:click={clearSearch}
								class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-amber-300/70 dark:border-amber-700/70 text-amber-700 dark:text-amber-300 hover:bg-amber-50/70 dark:hover:bg-amber-900/40 transition-all duration-300"
							>
								<i class="fa-solid fa-times"></i>
								<span>Limpar</span>
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Mensagens de Status -->
		{#if errorMessage}
			<div class="max-w-2xl mx-auto mb-6">
				<div class="rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/60 p-4 animate-fade-in-up">
					<div class="flex items-center gap-3">
						<i class="fa-solid fa-exclamation-triangle text-red-600"></i>
						<span class="text-red-800 dark:text-red-200">{errorMessage}</span>
					</div>
				</div>
			</div>
		{/if}

		{#if successMessage}
			<div class="max-w-2xl mx-auto mb-6">
				<div class="rounded-xl bg-green-50/80 dark:bg-green-950/40 border border-green-200/70 dark:border-green-800/60 p-4 animate-fade-in-up">
					<div class="flex items-center gap-3">
						<i class="fa-solid fa-check-circle text-green-600"></i>
						<span class="text-green-800 dark:text-green-200">{successMessage}</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Resultados da Busca -->
		{#if searchResults.length > 0}
			<div class="max-w-4xl mx-auto">
				<div class="rounded-2xl border border-amber-200/70 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 backdrop-blur p-6 md:p-8 shadow-lg feature-card-animated">
					<h2 class="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-6 flex items-center gap-2">
						<i class="fa-solid fa-users"></i>
						Usuários Encontrados
					</h2>
					
					<div class="grid gap-4">
						{#each searchResults as user, index}
							<div class="rounded-xl bg-white/60 dark:bg-amber-900/30 border border-amber-200/50 dark:border-amber-700/50 p-4 hover:bg-white/80 dark:hover:bg-amber-900/50 transition-all duration-300 hover:shadow-md animate-fade-in-up" style="animation-delay: {index * 0.1}s;">
								<div class="flex items-center justify-between">
									<div class="flex-1">
										<div class="flex items-center gap-3 mb-2">
											<div class="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center">
												<i class="fa-solid fa-user text-white text-sm"></i>
											</div>
											<div>
												<h3 class="font-semibold text-amber-900 dark:text-amber-100">{user.Nome}</h3>
												<p class="text-sm text-amber-700 dark:text-amber-300">CPF: {formatCPF(user.CPF)}</p>
											</div>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<button
											on:click={() => copyCPF(user.CPF)}
											class="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-800/40 hover:bg-amber-200/70 dark:hover:bg-amber-700/40 transition-all duration-300"
											title="Copiar CPF"
										>
											<i class="fa-solid fa-copy text-xs"></i>
											<span class="text-xs hidden sm:inline">Copiar</span>
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Dica de Uso -->
		{#if searchResults.length === 0 && !errorMessage && !isLoading}
			<div class="max-w-2xl mx-auto mt-8">
				<div class="rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50 p-6 text-center">
					<i class="fa-solid fa-lightbulb text-2xl text-amber-600 mb-3"></i>
					<h3 class="font-semibold text-amber-900 dark:text-amber-100 mb-2">Dica de Uso</h3>
					<p class="text-sm text-amber-700 dark:text-amber-300">
						Digite pelo menos 3 dígitos do CPF para iniciar a busca. Você pode usar apenas números ou com a formatação completa (000.000.000-00).
					</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.feature-card-animated {
		position: relative;
		overflow: hidden;
	}
	
	.feature-card-animated::after {
		content: "";
		position: absolute;
		top: -100%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(ellipse at top left, rgba(255,255,255,0.18), rgba(255,255,255,0) 45%);
		transform: rotate(15deg);
		transition: transform .6s ease, opacity .6s ease;
		opacity: 0;
		pointer-events: none;
	}
	
	.feature-card-animated:hover::after {
		transform: translateY(40%) rotate(15deg);
		opacity: 1;
	}

	@keyframes fadeInUp {
		from { 
			opacity: 0; 
			transform: translateY(12px); 
		}
		to { 
			opacity: 1; 
			transform: translateY(0); 
		}
	}
	
	.animate-fade-in-up { 
		animation: fadeInUp .6s ease-out both; 
	}
</style>
