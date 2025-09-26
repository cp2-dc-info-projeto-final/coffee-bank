<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let stats = {
    totalUsers: 0,
    totalAdmins: 0,
    totalTransfers: 0,
    totalBalance: 0,
    todayUsers: 0,
    todayTransfers: 0
  };
  let isLoading = true;
  let error = '';
  let sidebarOpen = false;
  let activeSection = 'dashboard';

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'users', name: 'Usuários', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { id: 'admins', name: 'Administradores', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'transfers', name: 'Transferências', icon: 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4' },
    { id: 'reports', name: 'Relatórios', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
  ];

  onMount(async () => {
    await loadStats();
  });

  async function loadStats() {
    try {
      isLoading = true;
      const response = await fetch('http://localhost:3000/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        stats = data.data;
      } else {
        error = 'Erro ao carregar estatísticas';
      }
    } catch (err) {
      console.error('Erro ao carregar stats:', err);
      error = 'Erro de conexão';
    } finally {
      isLoading = false;
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function setActiveSection(sectionId: string) {
    activeSection = sectionId;
    if (sectionId === 'users') {
      goto('/admin/users');
    } else if (sectionId === 'admins') {
      goto('/admin/admins');
    } else if (sectionId === 'reports') {
      goto('/admin/reports');
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Coffee Bank Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex">
  <!-- Sidebar -->
  <div class="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-[#1f5f61] to-[#36544f] transform transition-all duration-500 ease-in-out {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 shadow-2xl">
    <div class="flex flex-col h-full">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/20">
        <div class="flex items-center space-x-3 animate-fade-in">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white animate-slide-in-left">Dashboard</h2>
            <p class="text-[#0b8185] text-sm animate-slide-in-left animation-delay-100">Coffee Bank Admin</p>
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
            class="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:scale-105 {activeSection === section.id ? 'bg-white/20 text-white shadow-lg animate-pulse' : 'text-[#0b8185] hover:bg-white/10 hover:text-white'} animate-fade-in-up"
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
          on:click={loadStats}
          class="w-full flex items-center space-x-3 px-4 py-3 text-[#0b8185] hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300 hover:scale-105"
        >
          <svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span class="font-medium">Atualizar Dados</span>
        </button>
      </div>
      
    </div>
    
  </div>

  <!-- Overlay for mobile -->
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
              <h1 class="text-2xl font-bold text-gray-900 transition-all duration-500">Dashboard</h1>
              <p class="text-gray-600 transition-all duration-500">Visão geral do sistema Coffee Bank</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              on:click={loadStats}
              class="inline-flex items-center px-4 py-2 bg-[#0b8185] text-white rounded-lg hover:bg-[#1f5f61] transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up"
            >
              <svg class="h-5 w-5 mr-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Atualizar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 p-6">
      <div class="w-full max-w-7xl mx-auto">
        {#if isLoading}
          <div class="flex items-center justify-center py-20 animate-fade-in">
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0b8185] mx-auto mb-4"></div>
              <p class="text-[#0b8185] font-medium text-lg animate-pulse">Carregando dados...</p>
            </div>
          </div>
        {:else if error}
          <div class="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-md animate-fade-in-up">
            <div class="flex items-center">
              <svg class="w-6 h-6 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-semibold">Erro ao carregar dados</h3>
                <p class="text-sm">{error}</p>
              </div>
            </div>
          </div>
        {:else}
          <!-- Stats Grid -->
          <div class="space-y-6 animate-fade-in">
            <!-- Key Metrics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p class="text-2xl font-bold text-gray-900 animate-count-up">{formatNumber(stats.totalUsers)}</p>
                  </div>
                  <div class="w-12 h-12 bg-[#0b8185]/10 rounded-lg flex items-center justify-center animate-pulse">
                    <svg class="w-6 h-6 text-[#0b8185] transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="mt-4 flex items-center text-sm text-[#0b8185] animate-fade-in-up animation-delay-200">
                  <svg class="w-4 h-4 mr-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                  </svg>
                  +{stats.todayUsers} novos hoje
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-100">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Transferências</p>
                    <p class="text-2xl font-bold text-gray-900 animate-count-up">{formatNumber(stats.totalTransfers)}</p>
                  </div>
                  <div class="w-12 h-12 bg-[#1f5f61]/10 rounded-lg flex items-center justify-center animate-pulse">
                    <svg class="w-6 h-6 text-[#1f5f61] transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </div>
                <div class="mt-4 flex items-center text-sm text-[#1f5f61] animate-fade-in-up animation-delay-200">
                  <svg class="w-4 h-4 mr-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                  </svg>
                  +{stats.todayTransfers} hoje
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Volume Total</p>
                    <p class="text-2xl font-bold text-gray-900 animate-count-up">{formatCurrency(stats.totalBalance)}</p>
                  </div>
                  <div class="w-12 h-12 bg-[#403831]/10 rounded-lg flex items-center justify-center animate-pulse">
                    <svg class="w-6 h-6 text-[#403831] transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                </div>
                <div class="mt-4 flex items-center text-sm text-[#403831] animate-fade-in-up animation-delay-200">
                  <svg class="w-4 h-4 mr-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  </svg>
                  Em cafés
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-300">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Administradores</p>
                    <p class="text-2xl font-bold text-gray-900 animate-count-up">{formatNumber(stats.totalAdmins)}</p>
                  </div>
                  <div class="w-12 h-12 bg-[#36544f]/10 rounded-lg flex items-center justify-center animate-pulse">
                    <svg class="w-6 h-6 text-[#36544f] transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                </div>
                <div class="mt-4 flex items-center text-sm text-[#36544f] animate-fade-in-up animation-delay-200">
                  <svg class="w-4 h-4 mr-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Acesso completo
                </div>
              </div>
            </div>

            <!-- Activity Chart Placeholder -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-400">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 animate-fade-in">Atividade Diária</h3>
              <div class="h-64 bg-gradient-to-br from-[#0b8185]/5 to-[#1f5f61]/5 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <div class="text-center animate-fade-in-up">
                  <svg class="w-16 h-16 text-[#0b8185]/30 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <p class="text-[#0b8185] font-medium">Gráfico de Atividade</p>
                  <p class="text-gray-500 text-sm">Visualização dos dados em tempo real</p>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up animation-delay-500">
              <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                <h3 class="text-2xl font-bold text-gray-900">Ações Rápidas</h3>
                <p class="text-gray-600 mt-1">Acesse rapidamente as principais funcionalidades</p>
              </div>
              <div class="p-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <a 
                    href="/admin/users" 
                    class="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0b8185] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                    style="animation-delay: 600ms"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-16 h-16 bg-gradient-to-br from-[#0b8185] to-[#1f5f61] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">Gerenciar Usuários</h4>
                      <p class="text-sm text-gray-600">Visualizar, buscar e gerenciar usuários do sistema</p>
                    </div>
                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0b8185]/0 to-[#0b8185]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  <a 
                    href="/admin/admins" 
                    class="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-[#36544f] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                    style="animation-delay: 700ms"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-16 h-16 bg-gradient-to-br from-[#36544f] to-[#1f5f61] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">Gerenciar Admins</h4>
                      <p class="text-sm text-gray-600">Criar, editar e excluir administradores</p>
                    </div>
                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#36544f]/0 to-[#36544f]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  <a 
                    href="/admin/reports" 
                    class="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0b8185] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                    style="animation-delay: 800ms"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-16 h-16 bg-gradient-to-br from-[#0b8185] to-[#1f5f61] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">Relatórios</h4>
                      <p class="text-sm text-gray-600">Visualizar relatórios e análises do sistema</p>
                    </div>
                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0b8185]/0 to-[#0b8185]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>

                  <button 
                    on:click={loadStats}
                    class="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-[#403831] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                    style="animation-delay: 900ms"
                  >
                    <div class="flex flex-col items-center text-center">
                      <div class="w-16 h-16 bg-gradient-to-br from-[#403831] to-[#30261c] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">Atualizar Dados</h4>
                      <p class="text-sm text-gray-600">Recarregar estatísticas do sistema</p>
                    </div>
                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#403831]/0 to-[#403831]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

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
  
  .animation-delay-400 {
    animation-delay: 400ms;
  }
  
  .animation-delay-500 {
    animation-delay: 500ms;
  }
</style>
