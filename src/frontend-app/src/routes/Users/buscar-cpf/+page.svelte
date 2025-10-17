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
<header class="relative w-full bg-gray-800 border-b border-gray-700">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
					<img src={logo} alt="Coffee Bank" class="h-6 w-6 sm:h-8 sm:w-8" />
				</div>
				<div>
					<h1 class="text-lg sm:text-2xl font-bold text-white">Buscar Usuários</h1>
					<p class="text-xs sm:text-sm text-gray-400 hidden sm:block">Encontre usuários por CPF</p>
				</div>
			</div>
			<nav class="flex items-center gap-2 sm:gap-3">
				<a href="/Users" class="group inline-flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 rounded-lg text-gray-300 bg-gray-700/50 hover:bg-gray-700 hover:text-white transition-all duration-300 hover:shadow-lg">
					<i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform duration-300 text-sm sm:text-base"></i>
					<span class="hidden sm:inline text-sm">Voltar</span>
				</a>
			</nav>
		</div>
	</div>
</header>

<!-- Main Content -->
<section class="min-h-screen bg-gray-900 py-8">
	<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
		
		<!-- Título e Descrição -->
		<div class="text-center mb-8 sm:mb-12 animate-fade-in-up">
			<div class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
				<i class="fa-solid fa-search text-white text-lg sm:text-2xl"></i>
			</div>
			<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 sm:mb-4 px-4">
				Buscar Usuários por CPF
			</h1>
			<p class="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
				Encontre usuários cadastrados no sistema digitando o CPF ou parte dele
			</p>
		</div>

		<!-- Formulário de Busca -->
		<div class="max-w-3xl mx-auto mb-6 sm:mb-8">
			<div class="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift shine-effect animate-scale-in">
				<div class="space-y-4 sm:space-y-6">
					<div class="text-center">
						<h2 class="text-lg sm:text-xl font-semibold text-white mb-2">Digite o CPF para buscar</h2>
						<p class="text-gray-400 text-xs sm:text-sm">Use apenas números ou com formatação (000.000.000-00)</p>
					</div>
					
					<div>
						<label for="cpf-search" class="block text-sm font-medium text-gray-300 mb-3">
							CPF do Usuário
						</label>
						<div class="relative group">
							<input
								id="cpf-search"
								type="text"
								bind:value={searchTerm}
								on:keypress={handleKeyPress}
								placeholder="Digite o CPF (apenas números ou com formatação)"
								class="w-full px-4 py-4 pl-12 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:border-gray-500"
								disabled={isLoading}
							/>
							<i class="fa-solid fa-id-card absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300"></i>
						</div>
					</div>
					
					<div class="flex flex-col sm:flex-row gap-3">
						<button
							on:click={searchCPF}
							disabled={isLoading || !searchTerm.trim()}
							class="group flex-1 inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0"
						>
							{#if isLoading}
								<i class="fa-solid fa-spinner fa-spin text-sm sm:text-base"></i>
								<span class="text-sm sm:text-base">Buscando usuários...</span>
							{:else}
								<i class="fa-solid fa-search group-hover:scale-110 transition-transform duration-300 text-sm sm:text-base"></i>
								<span class="text-sm sm:text-base">Buscar Usuários</span>
							{/if}
						</button>
						
						{#if searchResults.length > 0 || errorMessage}
							<button
								on:click={clearSearch}
								class="group inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-all duration-300"
							>
								<i class="fa-solid fa-times group-hover:rotate-90 transition-transform duration-300 text-sm sm:text-base"></i>
								<span class="text-sm sm:text-base">Limpar</span>
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Mensagens de Status -->
		{#if errorMessage}
			<div class="max-w-3xl mx-auto mb-6">
				<div class="bg-red-900/20 border border-red-500/30 rounded-xl p-4 animate-fade-in-up">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
							<i class="fa-solid fa-exclamation-triangle text-red-400 text-sm"></i>
						</div>
						<span class="text-red-300 font-medium">{errorMessage}</span>
					</div>
				</div>
			</div>
		{/if}

		{#if successMessage}
			<div class="max-w-3xl mx-auto mb-6">
				<div class="bg-green-900/20 border border-green-500/30 rounded-xl p-4 animate-fade-in-up">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
							<i class="fa-solid fa-check-circle text-green-400 text-sm"></i>
						</div>
						<span class="text-green-300 font-medium">{successMessage}</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Resultados da Busca -->
		{#if searchResults.length > 0}
			<div class="max-w-5xl mx-auto">
				<div class="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-6 lg:p-8 shadow-xl hover-lift animate-fade-in-up">
					<div class="flex items-center gap-3 mb-6 sm:mb-8">
						<div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
							<i class="fa-solid fa-users text-white text-sm sm:text-base"></i>
						</div>
						<div>
							<h2 class="text-lg sm:text-2xl font-bold text-white">Usuários Encontrados</h2>
							<p class="text-gray-400 text-xs sm:text-sm">{searchResults.length} resultado(s) encontrado(s)</p>
						</div>
					</div>
					
					<div class="grid gap-3 sm:gap-4">
						{#each searchResults as user, index}
							<div class="group bg-gray-700 rounded-xl border border-gray-600 p-4 sm:p-6 hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style="animation-delay: {index * 0.1}s;">
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div class="flex items-center gap-3 sm:gap-4">
										<div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
											<i class="fa-solid fa-user text-white text-sm sm:text-lg"></i>
										</div>
										<div class="flex-1 min-w-0">
											<h3 class="text-base sm:text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300 truncate">{user.Nome}</h3>
											<div class="flex items-center gap-2 mt-1">
												<i class="fa-solid fa-id-card text-gray-400 text-xs sm:text-sm"></i>
												<p class="text-gray-300 font-mono text-xs sm:text-sm">CPF: {formatCPF(user.CPF)}</p>
											</div>
										</div>
									</div>
									<div class="flex items-center gap-2 sm:gap-3">
										<button
											on:click={() => copyCPF(user.CPF)}
											class="group/btn inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto justify-center"
											title="Copiar CPF"
										>
											<i class="fa-solid fa-copy text-xs sm:text-sm group-hover/btn:scale-110 transition-transform duration-300"></i>
											<span class="text-xs sm:text-sm font-medium">Copiar CPF</span>
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
			<div class="max-w-3xl mx-auto mt-6 sm:mt-8">
				<div class="bg-gray-800 border border-gray-700 rounded-xl p-6 sm:p-8 text-center hover-lift animate-fade-in-up">
					<div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
						<i class="fa-solid fa-lightbulb text-white text-lg sm:text-2xl"></i>
					</div>
					<h3 class="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Dica de Uso</h3>
					<p class="text-gray-400 text-sm sm:text-base leading-relaxed px-2">
						Digite pelo menos 3 dígitos do CPF para iniciar a busca. Você pode usar apenas números ou com a formatação completa (000.000.000-00).
					</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Animações profissionais e suaves */
	@keyframes fadeInUp {
		from { 
			opacity: 0; 
			transform: translateY(20px); 
		}
		to { 
			opacity: 1; 
			transform: translateY(0); 
		}
	}
	
	
	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	
	.animate-fade-in-up { 
		animation: fadeInUp 0.6s ease-out both; 
	}
	
	.animate-scale-in {
		animation: scaleIn 0.5s ease-out both;
	}
	
	/* Efeitos de hover suaves */
	.hover-lift {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.hover-lift:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
	}
	
	
	/* Efeito de brilho sutil */
	.shine-effect {
		position: relative;
		overflow: hidden;
	}
	
	.shine-effect::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
		transition: left 0.6s ease;
	}
	
	.shine-effect:hover::before {
		left: 100%;
	}
</style>
