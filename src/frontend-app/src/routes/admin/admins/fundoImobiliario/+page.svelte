<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import axios from 'axios';

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

	// Função para obter o token de autenticação
	function getAuthToken() {
		if (typeof window !== 'undefined') {
			return sessionStorage.getItem('auth_token');
		}
		return null;
	}

	// Função para configurar headers de autenticação
	function getAuthHeaders() {
		const token = getAuthToken();
		return token ? { Authorization: `Bearer ${token}` } : {};
	}
	interface FundoImobiliario {
		id: string;
		CPF: string;
		Area: number;
		AreaTotal: number;
		Numero: number;
		porcentagem: number;
		DF: string;
		Nome: string;
		Compra: number;
		Preco: number;
	}

	let fundoImobiliarios: FundoImobiliario[] = [];
	let isLoading = true;
	let error = '';
	let success = '';
	let showEditModal = false;
	let showDeleteModal = false;
	let fundoToEdit: FundoImobiliario | null = null;
	let fundoToDelete: FundoImobiliario | null = null;
	let sidebarOpen = false;
	let activeSection = 'list';

	let formData = {
		CPF: "",
		Area: 0,
		AreaTotal: 0,
		Numero:0,
		porcentagem: 0,
		DF: "",
		Nome: "",
		Compra: 0,
		Preco: 0
	};

	const sections = [
		{ id: 'overview', name: 'Visão Geral', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
		{ id: 'list', name: 'Lista de Fundos', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
		{ id: 'create', name: 'Criar Fundo', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
		{ id: 'analytics', name: 'Análises', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
		{ id: 'reports', name: 'Relatórios', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
	];

	onMount(() => {
		loadFundosImobiliarios();
	});

	async function loadFundosImobiliarios() {
		try {
			isLoading = true;
			const resposta = await api.get("/investment");
			fundoImobiliarios = resposta.data.Data || [];
			console.log(fundoImobiliarios)
			error = '';
		} catch (err) {
			console.error('Erro ao carregar fundos imobiliários:', err);
			error = 'Erro ao carregar fundos imobiliários';
		} finally {
			isLoading = false;
		}
	}

	function openEditModal(fundo: FundoImobiliario) {
		fundoToEdit = fundo;
		console.log(fundo.AreaVendida)
		formData = {
			CPF: fundo.CPF || "",
			AreaVendida: fundo.AreaVendida || 0,
			AreaTotal: fundo.AreaTotal || 0,
			Numero: fundo.Numero || 0,
			porcentagem: fundo.porcentagem || 0,
			DF: fundo.DF || "",
			Nome: fundo.Nome || "",
			Compra: fundo.Compra || 0,
			Preco: fundo.Preco || 0
		};
		showEditModal = true;
	}

	function confirmDelete(fundo: FundoImobiliario) {
		fundoToDelete = fundo;
		showDeleteModal = true;
	}

	async function updateFundoImobiliario() {
		console.log(formData)
		if (!formData.Nome || !formData.CPF) {
			error = 'Nome e CPF são obrigatórios';
			return;
		}

		if (!fundoToEdit) {
			error = 'Nenhum fundo selecionado para edição';
			return;
		}

		try {
			const response = await api.put(`/investment/${fundoToEdit.id}`, formData, {
				headers: getAuthHeaders()
			});
			
			if (response.data.Sucess || response.data.success) {
				success = 'Fundo Imobiliário atualizado com sucesso!';
				showEditModal = false;
				fundoToEdit = null;
				loadFundosImobiliarios();
			} else {
				error = response.data.Message || response.data.message || 'Erro ao atualizar fundo imobiliário';
			}
		} catch (err: any) {
			console.error('Erro ao atualizar fundo:', err);
			if (err.response?.status === 401) {
				error = 'Token de autenticação inválido ou expirado';
			} else if (err.response?.status === 403) {
				error = 'Acesso negado: requer privilégios de administrador';
			} else {
				error = err.response?.data?.message || err.response?.data?.Message || 'Erro de conexão';
			}
		}
	}

	async function executeDelete() {
		if (!fundoToDelete) return;

		try {
			const response = await api.delete(`/investment/${fundoToDelete.id}`, {
				headers: getAuthHeaders()
			});

			if (response.data.success) {
				success = 'Fundo Imobiliário excluído com sucesso!';
				showDeleteModal = false;
				fundoToDelete = null;
				loadFundosImobiliarios();
			} else {
				error = response.data.message || 'Erro ao excluir fundo imobiliário';
			}
		} catch (err: any) {
			console.error('Erro ao excluir fundo:', err);
			if (err.response?.status === 401) {
				error = 'Token de autenticação inválido ou expirado';
			} else if (err.response?.status === 403) {
				error = 'Acesso negado: requer privilégios de administrador';
			} else {
				error = err.response?.data?.message || 'Erro de conexão';
			}
		}
	}

	function cancelModal() {
		showEditModal = false;
		showDeleteModal = false;
		fundoToEdit = null;
		fundoToDelete = null;
		formData = {
			CPF: "",
			Area: 0,
			AreaTotal: 0,
			Numero: 0,
			porcentagem: 0,
			DF: "",
			Nome: "",
			Compra: 0,
			Preco: 0
		};
		error = '';
		success = '';
	}

	function formatCurrency(value: string | number) {
		if (!value) return '0';
		const numbers = value.toString().replace(/\D/g, '');
		return numbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
	}

	function formatPercentage(value: string | number) {
		if (!value) return '0';
		return value.toString();
	}

	function formatCPF(value: string) {
		const numbers = value.replace(/\D/g, '');
		return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}

	function handleCurrencyInput(event: Event, field: keyof typeof formData) {
		const target = event.target as HTMLInputElement;
		(formData as any)[field] = formatCurrency(target.value);
	}

	function handlePercentageInput(event: Event) {
		const target = event.target as HTMLInputElement;
		formData.porcentagem = Number(formatPercentage(target.value));
	}

	function handleCPFInput(event: Event) {
		const target = event.target as HTMLInputElement;
		formData.CPF = formatCPF(target.value);
	}

	function goBack() {
		goto('/admin/admins');
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function setActiveSection(sectionId: string) {
		activeSection = sectionId;
		if (sectionId === 'create') {
			goto('/admin/admins');
		}
	}

	function formatDate(dateString: string) {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('pt-BR');
	}

	function calculateTotalValue(fundo: FundoImobiliario) {
		console.log(fundo)
		return (fundo.Compra || 0) * (fundo.porcentagem || 0) / 100;
	}

	function calculateAreaPercentage(fundo: FundoImobiliario) {
		console.log(fundo)
		if (!fundo.AreaTotal || fundo.Area === 0) return 0;
		return ((fundo.Area || 0) / fundo.AreaTotal) * 100;
	}
</script>

<svelte:head>
	<title>Gerenciar Fundos Imobiliários - Coffee Bank Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex">
	<!-- Sidebar -->
	<div class="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-amber-600/90 to-amber-800/90 backdrop-blur-sm transform transition-all duration-500 ease-in-out {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 shadow-2xl">
		<div class="flex flex-col h-full">
			<!-- Sidebar Header -->
			<div class="flex items-center justify-between p-6 border-b border-white/20">
				<div class="flex items-center space-x-3 animate-fade-in">
					<div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
						</svg>
					</div>
					<div>
						<h2 class="text-xl font-bold text-white animate-slide-in-left">Fundos Imobiliários</h2>
						<p class="text-amber-200/80 text-sm animate-slide-in-left animation-delay-100">Coffee Bank Admin</p>
					</div>
				</div>
				<button
					on:click={toggleSidebar}
					class="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110"
					aria-label="Fechar barra lateral"
				>
					<svg class="w-6 h-6 text-white transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 px-4 py-6 space-y-2">
				{#each sections as section, index}
					<button
						on:click={() => setActiveSection(section.id)}
						class="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:scale-105 {activeSection === section.id ? 'bg-white/20 text-white shadow-lg animate-pulse' : 'text-amber-200/80 hover:bg-white/10 hover:text-white'} animate-fade-in-up"
						style="animation-delay: {index * 100}ms"
					>
						<svg class="w-5 h-5 transition-transform duration-300 {activeSection === section.id ? 'scale-110' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{section.icon}"></path>
						</svg>
						<span class="font-medium transition-all duration-300">{section.name}</span>
					</button>
				{/each}
			</nav>

			<!-- Sidebar Footer -->
			<div class="p-6 border-t border-white/20 animate-fade-in-up animation-delay-500">
				<button
					on:click={goBack}
					class="w-full flex items-center space-x-3 px-4 py-3 text-amber-200/80 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300 hover:scale-105"
				>
					<svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
					</svg>
					<span class="font-medium">Voltar aos Administradores</span>
				</button>
			</div>
		</div>
	</div>

	{#if sidebarOpen}
		<div 
			class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden animate-fade-in" 
			on:click={toggleSidebar}
			on:keydown={(e) => e.key === 'Escape' && toggleSidebar()}
			role="button"
			tabindex="0"
			aria-label="Fechar barra lateral"
		></div>
	{/if}

	<!-- Main Content -->
	<div class="flex-1 flex flex-col min-h-screen">
		<!-- Top Header -->
		<div class="bg-white shadow-sm border-b border-gray-200 animate-fade-in-down">
			<div class="px-6 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-4">
						<button
							on:click={toggleSidebar}
							class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
							aria-label="Abrir barra lateral"
						>
							<svg class="w-6 h-6 text-gray-600 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						</button>
						<div class="animate-slide-in-right">
							<h1 class="text-2xl font-bold text-gray-900 transition-all duration-500">{sections.find(s => s.id === activeSection)?.name || 'Fundos Imobiliários'}</h1>
							<p class="text-gray-600 transition-all duration-500">Gerenciamento completo de fundos imobiliários</p>
						</div>
					</div>
					<div class="flex items-center space-x-4">
						<div class="bg-amber-600/10 rounded-xl p-4 text-center animate-fade-in-up">
							<div class="text-2xl font-bold text-amber-600 animate-count-up">{fundoImobiliarios.length}</div>
							<div class="text-amber-600 text-sm">Total de Fundos</div>
						</div>
						<button
							on:click={() => setActiveSection('create')}
							class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg hover:from-amber-700 hover:to-amber-900 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up"
						>
							<svg class="h-5 w-5 mr-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
							</svg>
							Novo Fundo
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="flex-1 flex items-center justify-center p-6">
			<div class="w-full mx-auto">
				<!-- Success Message -->
				{#if success}
					<div class="bg-green-50 border-l-4 border-green-400 text-green-700 p-6 rounded-lg shadow-md animate-fade-in-up mb-6">
						<div class="flex items-center">
							<svg class="w-6 h-6 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<div>
								<h3 class="font-semibold">Sucesso!</h3>
								<p class="text-sm">{success}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Error Message -->
				{#if error}
					<div class="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-md animate-fade-in-up mb-6">
						<div class="flex items-center">
							<svg class="w-6 h-6 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<div>
								<h3 class="font-semibold">Erro</h3>
								<p class="text-sm">{error}</p>
							</div>
						</div>
					</div>
				{/if}

				{#if activeSection === 'overview'}
					<!-- Overview Section -->
					<div class="space-y-6 animate-fade-in">
						<!-- Stats Cards -->
						<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up">
								<div class="flex items-center justify-between">
									<div>
										<p class="text-sm font-medium text-gray-600">Total de Fundos</p>
										<p class="text-3xl font-bold text-gray-900 animate-count-up">{fundoImobiliarios.length}</p>
									</div>
									<div class="w-12 h-12 bg-amber-600/10 rounded-lg flex items-center justify-center animate-pulse">
										<svg class="w-6 h-6 text-amber-600 transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
										</svg>
									</div>
								</div>
							</div>

							<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-100">
								<div class="flex items-center justify-between">
									<div>
										<p class="text-sm font-medium text-gray-600">Valor Total Investido</p>
										<p class="text-3xl font-bold text-gray-900 animate-count-up">
											R$ {fundoImobiliarios.reduce((total, fundo) => total + calculateTotalValue(fundo), 0).toLocaleString('pt-BR')}
										</p>
									</div>
									<div class="w-12 h-12 bg-amber-700/10 rounded-lg flex items-center justify-center animate-pulse">
										<svg class="w-6 h-6 text-amber-700 transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
										</svg>
									</div>
								</div>
							</div>

							<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-200">
								<div class="flex items-center justify-between">
									<div>
										<p class="text-sm font-medium text-gray-600">Área Total (m²)</p>
										<p class="text-3xl font-bold text-gray-900 animate-count-up">
											{fundoImobiliarios.reduce((total, fundo) => total + (fundo.AreaTotal || 0), 0).toLocaleString('pt-BR')}
										</p>
									</div>
									<div class="w-12 h-12 bg-amber-800/10 rounded-lg flex items-center justify-center animate-pulse">
										<svg class="w-6 h-6 text-amber-800 transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
										</svg>
									</div>
								</div>
							</div>
						</div>

						<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-300">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Fundos Imobiliários Recentes</h3>
							{#if fundoImobiliarios.length > 0}
								<div class="space-y-4">
									{#each fundoImobiliarios.slice(0, 3) as fundo}
										<div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
											
											<div class="flex-1">
												<p class="font-medium text-gray-900">{fundo.Nome || 'Sem nome'}</p>
												<p class="text-sm text-gray-500">CPF: {fundo.CPF || 'N/A'}</p>
											</div>
											<div class="text-right">
												<p class="text-sm font-medium text-amber-600">R$ {calculateTotalValue(fundo).toLocaleString('pt-BR')}</p>
												<p class="text-xs text-gray-500">{fundo.porcentagem || 0}%</p>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-gray-500 text-center py-8">Nenhum fundo imobiliário encontrado</p>
							{/if}
						</div>
					</div>

				{:else if activeSection === 'list'}
					<!-- List Section -->
					<div class="space-y-6 animate-fade-in">
						<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
							{#if isLoading}
								<div class="flex items-center justify-center py-20">
									<div class="text-center">
										<div class="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
										<p class="text-amber-600 font-medium text-lg animate-pulse">Carregando fundos imobiliários...</p>
									</div>
								</div>
							{:else if fundoImobiliarios.length === 0}
								<div class="text-center py-20">
									<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in-up">
										<svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
										</svg>
									</div>
									<h3 class="text-xl font-semibold text-gray-900 mb-2 animate-fade-in-up">Nenhum fundo imobiliário encontrado</h3>
									<p class="text-gray-600 mb-6 animate-fade-in-up">Comece criando um novo fundo imobiliário no sistema.</p>
									<button
										on:click={() => setActiveSection('create')}
										class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 transition-all duration-300 hover:scale-105 animate-fade-in-up"
									>
										<svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
										</svg>
										Criar Primeiro Fundo
									</button>
								</div>
							{:else}
								<div class="overflow-x-auto">
									<table class="min-w-full divide-y divide-gray-200">
										<thead class="bg-gray-50">
											<tr>
												<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fundo</th>
												<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investidor</th>
												<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
												<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
												<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
											</tr>
										</thead>
										<tbody class="bg-white divide-y divide-gray-200">
											{#each fundoImobiliarios as fundo, index}
												<tr class="hover:bg-gray-100 transition-all duration-300 hover:scale-[1.0005] animate-fade-in-up" style="animation-delay: {index * 100}ms">
													<td class="px-6 py-4 whitespace-nowrap">
														<div class="flex items-center">
															<div class="flex-shrink-0 h-12 w-12">
																<div class="h-12 w-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center animate-pulse">
																	<span class="text-white font-bold text-lg">
																		{fundo.Nome?.charAt(0)?.toUpperCase() || 'F'}
																	</span>
																</div>
															</div>
															<div class="ml-4">
																<div class="text-lg font-semibold text-gray-900">{fundo.Nome || 'Sem nome'}</div>
																<div class="text-sm text-gray-500">Distrito {fundo.DF || 'N/A'}</div>
															</div>
														</div>
													</td>
													<td class="px-6 py-4 whitespace-nowrap">
														<div class="text-sm font-medium text-gray-900">{fundo.DonodoInvestimento || 'N/A'}</div>
													</td>
													<td class="px-6 py-4 whitespace-nowrap">
														<div class="text-sm text-gray-900">{fundo.AreaTotal || 0} m²</div>
														<div class="text-xs text-gray-500">{fundo.AreaVendida/fundo.AreaTotal}% do total</div>
													</td>
													<td class="px-6 py-4 whitespace-nowrap">
														<div class="text-sm font-medium text-amber-600">R$ {(fundo.Compra/(fundo.Porcentagem/100)).toLocaleString('pt-BR')}</div>
														<div class="text-xs text-gray-500">{fundo.Porcentagem || 0}% por R$ {(fundo.Compra || 0).toLocaleString('pt-BR')}</div>
													</td>
													<td class="px-6 py-4 whitespace-nowrap">
														<div class="flex items-center space-x-3">
															<button
																on:click={() => openEditModal(fundo)}
																class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 hover:scale-105"
															>
																<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
																</svg>
																Editar
															</button>
															<button
																on:click={() => confirmDelete(fundo)}
																class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:scale-105"
															>
																<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
																</svg>
																Excluir
															</button>
														</div>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							{/if}
						</div>
					</div>

				{:else if activeSection === 'analytics'}

					<div class="space-y-6 animate-fade-in">
						<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Análises dos Fundos Imobiliários</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div class="bg-amber-600/5 rounded-lg p-6">
									<h4 class="font-medium text-amber-600 mb-2">Distribuição por Distrito</h4>
									<div class="h-48 bg-gradient-to-br from-amber-600/10 to-amber-800/10 rounded-lg flex items-center justify-center">
										<div class="text-center">
											<svg class="w-12 h-12 text-amber-600/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
											</svg>
											<p class="text-amber-600 font-medium">Análise Geográfica</p>
										</div>
									</div>
								</div>
								<div class="bg-amber-700/5 rounded-lg p-6">
									<h4 class="font-medium text-amber-700 mb-2">Performance de Investimento</h4>
									<div class="h-48 bg-gradient-to-br from-amber-700/10 to-amber-800/10 rounded-lg flex items-center justify-center">
										<div class="text-center">
											<svg class="w-12 h-12 text-amber-700/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
											</svg>
											<p class="text-amber-700 font-medium">Rendimento</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

				{:else if activeSection === 'reports'}
					<!-- Reports Section -->
					<div class="space-y-6 animate-fade-in">
						<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Relatórios de Fundos Imobiliários</h3>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div class="bg-amber-800/5 rounded-lg p-6">
									<h4 class="font-medium text-amber-800 mb-2">Relatório Financeiro</h4>
									<div class="h-48 bg-gradient-to-br from-amber-800/10 to-amber-900/10 rounded-lg flex items-center justify-center">
										<div class="text-center">
											<svg class="w-12 h-12 text-amber-800/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
											</svg>
											<p class="text-amber-800 font-medium">Relatório Detalhado</p>
										</div>
									</div>
								</div>
								<div class="bg-amber-900/5 rounded-lg p-6">
									<h4 class="font-medium text-amber-900 mb-2">Exportar Dados</h4>
									<div class="h-48 bg-gradient-to-br from-amber-900/10 to-yellow-900/10 rounded-lg flex items-center justify-center">
										<div class="text-center">
											<svg class="w-12 h-12 text-amber-900/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
											</svg>
											<p class="text-amber-900 font-medium">Exportação</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Editar Modal -->
{#if showEditModal && fundoToEdit}
	<div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
		<div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
			<div class="p-8">
				<div class="text-center mb-6">
					<div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-amber-600/10 mb-4">
						<svg class="h-8 w-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
						</svg>
					</div>
					<h3 class="text-2xl font-bold text-gray-900">Editar Fundo Imobiliário</h3>
					<p class="text-gray-600 mt-2">Atualize as informações do fundo imobiliário</p>
				</div>
				
				<form on:submit|preventDefault={updateFundoImobiliario} class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<!-- Nome -->
						<div>
							<label for="edit-nome" class="block text-sm font-medium text-gray-700 mb-2">Nome do Fundo</label>
							<input
								id="edit-nome"
								type="text"
								bind:value={formData.Nome}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								placeholder="Digite o nome do fundo"
								required
							/>
						</div>

						<!-- CPF -->
						<div>
							<label for="edit-cpf" class="block text-sm font-medium text-gray-700 mb-2">CPF do Investidor</label>
							<input
								id="edit-cpf"
								type="text"
								bind:value={formData.CPF}
								on:input={handleCPFInput}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								placeholder="000.000.000-00"
								maxlength="14"
								required
							/>
						</div>

						<!-- Área -->
						<div>
							<label for="edit-area" class="block text-sm font-medium text-gray-700 mb-2">Área Vendida (m²)</label>
							<input
								id="edit-area"
								type="number"
								bind:value={formData.Area}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								placeholder="Digite a área vendida"
								min="0"
								step="0.01"
								required
							/>
						</div>

						<!-- Área Total -->
						<div>
							<label for="edit-areaTotal" class="block text-sm font-medium text-gray-700 mb-2">Área Total (m²)</label>
							<input
								id="edit-areaTotal"
								type="number"
								bind:value={formData.AreaTotal}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								placeholder="Digite a área total"
								min="0"
								step="0.01"
								required
							/>
						</div>

						<!-- Número -->
						<div>
							<label for="edit-numero" class="block text-sm font-medium text-gray-700 mb-2">Número de Investimentos</label>
							<input
								id="edit-numero"
								type="number"
								bind:value={formData.Numero}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								placeholder="Digite o número total de invesimmentos"
								min="0"
								step="0"
								required
							/>
						</div>

						<!-- Distrito Federal -->
						<div>
							<label for="edit-df" class="block text-sm font-medium text-gray-700 mb-2">Distrito Federal</label>
							<select
								id="edit-df"
								bind:value={formData.DF}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								required
							>
								<option value="">Selecione o distrito</option>
								<option value="1">Distrito 1</option>
								<option value="2">Distrito 2</option>
								<option value="3">Distrito 3</option>
								<option value="4">Distrito 4</option>
								<option value="5">Distrito 5</option>
							</select>
						</div>

						<!-- Porcentagem -->
						<div>
							<label for="edit-porcentagem" class="block text-sm font-medium text-gray-700 mb-2">Porcentagem (%)</label>
							<input
								id="edit-porcentagem"
								type="text"
								bind:value={formData.porcentagem}
								on:input={handlePercentageInput}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								placeholder="Digite a porcentagem"
								maxlength="3"
								required
							/>
						</div>

						<!-- Valor de Compra -->
						<div>
							<label for="edit-compra" class="block text-sm font-medium text-gray-700 mb-2">Valor Total (R$)</label>
							<input
								id="edit-compra"
								type="text"
								bind:value={formData.Compra}
								on:input={(e) => handleCurrencyInput(e, 'Compra')}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								placeholder="Digite o valor total"
								required
							/>
						</div>

						<!-- Preço Atual -->
						<div>
							<label for="edit-preco" class="block text-sm font-medium text-gray-700 mb-2">Preço Atual (R$)</label>
							<input
								id="edit-preco"
								type="text"
								bind:value={formData.Preco}
								on:input={(e) => handleCurrencyInput(e, 'Preco')}
								class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-colors"
								placeholder="Digite o preço atual"
								required
							/>
						</div>
					</div>

					<div class="flex space-x-4 pt-4">
						<button
							type="button"
							on:click={cancelModal}
							class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
						>
							Cancelar
						</button>
						<button
							type="submit"
							class="flex-1 px-6 py-3 bg-amber-600 text-white text-lg font-medium rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-600/30 transition-colors duration-200"
						>
							Salvar Alterações
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Confirmação De Deleção -->
{#if showDeleteModal && fundoToDelete}
	<div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
		<div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
			<div class="p-8">
				<div class="text-center">
					<div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
						<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
					</div>
					<h3 class="text-2xl font-bold text-gray-900 mb-4">⚠️ Confirmar Exclusão</h3>
					<div class="text-gray-600 mb-8">
						<p class="mb-4">
							Tem certeza que deseja excluir o fundo imobiliário:
						</p>
						<div class="bg-gray-50 rounded-lg p-4 mb-4">
							<p class="font-semibold text-gray-900 text-lg">{fundoToDelete.Nome || 'Sem nome'}</p>
							<p class="text-sm text-gray-600">CPF: {fundoToDelete.CPF || 'N/A'}</p>
							<p class="text-sm text-gray-600">Distrito: {fundoToDelete.DF || 'N/A'}</p>
							<p class="text-sm text-gray-600">Área: {fundoToDelete.Area || 0} m²</p>
						</div>
						<div class="bg-red-50 border border-red-200 rounded-lg p-4">
							<p class="text-red-800 font-medium">
								🚨 <strong>Atenção:</strong> Esta ação é irreversível!
							</p>
							<p class="text-red-700 text-sm mt-2">
								Todos os dados relacionados a este fundo imobiliário serão permanentemente removidos do sistema.
							</p>
						</div>
					</div>
					<div class="flex space-x-4">
						<button
							on:click={cancelModal}
							class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
						>
							Cancelar
						</button>
						<button
							on:click={executeDelete}
							class="flex-1 px-6 py-3 bg-red-600 text-white text-lg font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200"
						>
							Confirmar Exclusão
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
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
	
	@keyframes fade-in-down {
		from { 
			opacity: 0; 
			transform: translateY(-20px); 
		}
		to { 
			opacity: 1; 
			transform: translateY(0); 
		}
	}
	
	@keyframes slide-in-left {
		from { 
			opacity: 0; 
			transform: translateX(-20px); 
		}
		to { 
			opacity: 1; 
			transform: translateX(0); 
		}
	}
	
	@keyframes slide-in-right {
		from { 
			opacity: 0; 
			transform: translateX(20px); 
		}
		to { 
			opacity: 1; 
			transform: translateX(0); 
		}
	}
	
	@keyframes count-up {
		from { 
			opacity: 0; 
			transform: scale(0.8); 
		}
		to { 
			opacity: 1; 
			transform: scale(1); 
		}
	}
	
	.animate-fade-in {
		animation: fade-in 0.6s ease-out;
	}
	
	.animate-fade-in-up {
		animation: fade-in-up 0.6s ease-out;
	}
	
	.animate-fade-in-down {
		animation: fade-in-down 0.6s ease-out;
	}
	
	.animate-slide-in-left {
		animation: slide-in-left 0.6s ease-out;
	}
	
	.animate-slide-in-right {
		animation: slide-in-right 0.6s ease-out;
	}
	
	.animate-count-up {
		animation: count-up 0.8s ease-out;
	}
	
	.animation-delay-100 {
		animation-delay: 100ms;
	}
	
	.animation-delay-200 {
		animation-delay: 200ms;
	}
	
	.animation-delay-300 {
		animation-delay: 300ms;
	}
	
	.animation-delay-500 {
		animation-delay: 500ms;
	}
</style>