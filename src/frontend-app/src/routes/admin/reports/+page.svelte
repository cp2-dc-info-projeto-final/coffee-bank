<script>
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

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  function formatPercentage(value, total) {
    if (total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
  }

  function goBack() {
    goto('/admin');
  }
</script>

<svelte:head>
  <title>Relatórios - Coffee Bank Admin</title>
</svelte:head>

<div class="space-y-8">
  <!-- Header -->
  <div class="bg-gradient-to-r from-[#1f5f61] to-[#36544f] rounded-2xl p-8 text-white shadow-xl">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-6">
        <button
          on:click={goBack}
          class="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl transition-colors duration-200"
          title="Voltar ao Dashboard"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <div>
          <h1 class="text-4xl font-bold mb-2">Relatórios e Análises</h1>
          <p class="text-[#0b8185] text-lg">Visão detalhada e estatísticas do sistema Coffee Bank</p>
        </div>
      </div>
      <div class="hidden md:flex items-center space-x-4">
        <button
          on:click={loadStats}
          class="inline-flex items-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-[#0b8185] bg-white hover:bg-[#0b8185]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
        >
          <svg class="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Atualizar Dados
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Update Button -->
  <div class="md:hidden">
    <button
      on:click={loadStats}
      class="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-[#0b8185] hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b8185] transition-colors duration-200"
    >
      <svg class="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      Atualizar Relatórios
    </button>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0b8185] mx-auto mb-4"></div>
        <p class="text-[#0b8185] font-medium text-lg">Carregando relatórios...</p>
      </div>
    </div>
  {:else if error}
    <div class="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-md">
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="font-semibold">Erro ao carregar dados</h3>
          <p class="text-sm">{error}</p>
        </div>
      </div>
    </div>
  {:else}
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total de Usuários -->
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 mb-1">Total de Usuários</p>
              <p class="text-3xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-[#0b8185] to-[#1f5f61] rounded-xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-r from-[#0b8185]/10 to-[#1f5f61]/10 px-6 py-4">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-[#0b8185] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
            </svg>
            <span class="text-sm font-semibold text-[#0b8185]">+{stats.todayUsers}</span>
            <span class="text-sm text-gray-600 ml-1">novos hoje</span>
          </div>
        </div>
      </div>

      <!-- Total de Transferências -->
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 mb-1">Transferências</p>
              <p class="text-3xl font-bold text-gray-900">{formatNumber(stats.totalTransfers)}</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-[#0b8185] to-[#1f5f61] rounded-xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-r from-[#0b8185]/10 to-[#1f5f61]/10 px-6 py-4">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-[#0b8185] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
            </svg>
            <span class="text-sm font-semibold text-[#0b8185]">+{stats.todayTransfers}</span>
            <span class="text-sm text-gray-600 ml-1">hoje</span>
          </div>
        </div>
      </div>

      <!-- Saldo Total -->
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 mb-1">Volume Total</p>
              <p class="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalBalance)}</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-[#403831] to-[#30261c] rounded-xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-r from-[#403831]/10 to-[#30261c]/10 px-6 py-4">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-[#403831] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-sm font-medium text-[#403831]">Em cafés</span>
          </div>
        </div>
      </div>

      <!-- Administradores -->
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 mb-1">Administradores</p>
              <p class="text-3xl font-bold text-gray-900">{formatNumber(stats.totalAdmins)}</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-[#36544f] to-[#1f5f61] rounded-xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-r from-[#36544f]/10 to-[#1f5f61]/10 px-6 py-4">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-[#36544f] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium text-[#36544f]">Acesso completo</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Reports -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Activity Summary -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">Resumo de Atividade</h3>
          <p class="text-gray-600 mt-1">Métricas de atividade diária</p>
        </div>
        <div class="p-8">
          <dl class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            <div class="bg-[#0b8185]/10 rounded-xl p-6">
              <dt class="text-sm font-medium text-[#0b8185] mb-2">Novos usuários hoje</dt>
              <dd class="text-3xl font-bold text-[#0b8185]">{stats.todayUsers}</dd>
            </div>
            <div class="bg-[#0b8185]/10 rounded-xl p-6">
              <dt class="text-sm font-medium text-[#0b8185] mb-2">Transferências hoje</dt>
              <dd class="text-3xl font-bold text-[#0b8185]">{stats.todayTransfers}</dd>
            </div>
            <div class="bg-[#36544f]/10 rounded-xl p-6">
              <dt class="text-sm font-medium text-[#36544f] mb-2">Taxa de crescimento diário</dt>
              <dd class="text-3xl font-bold text-[#36544f]">
                {formatPercentage(stats.todayUsers, stats.totalUsers)}
              </dd>
            </div>
            <div class="bg-[#403831]/10 rounded-xl p-6">
              <dt class="text-sm font-medium text-[#403831] mb-2">Atividade de transferências</dt>
              <dd class="text-3xl font-bold text-[#403831]">
                {formatPercentage(stats.todayTransfers, stats.totalTransfers)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- System Health -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">Saúde do Sistema</h3>
          <p class="text-gray-600 mt-1">Status e performance do sistema</p>
        </div>
        <div class="p-8">
          <div class="space-y-8">
            <div>
              <div class="flex justify-between text-lg font-semibold text-gray-700 mb-3">
                <span>Usuários Ativos</span>
                <span>{formatNumber(stats.totalUsers)}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-[#0b8185] to-[#1f5f61] h-3 rounded-full transition-all duration-1000" style="width: 100%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-lg font-semibold text-gray-700 mb-3">
                <span>Transferências Processadas</span>
                <span>{formatNumber(stats.totalTransfers)}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000" style="width: 100%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-lg font-semibold text-gray-700 mb-3">
                <span>Volume Total em Cafés</span>
                <span>{formatCurrency(stats.totalBalance)}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-1000" style="width: 100%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <h3 class="text-xl font-bold text-gray-900">Estatísticas Rápidas</h3>
        <p class="text-gray-600 mt-1">Visão consolidada dos principais indicadores</p>
      </div>
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
            <div class="text-4xl font-bold text-blue-600 mb-2">{formatNumber(stats.totalUsers)}</div>
            <div class="text-lg font-medium text-blue-800">Usuários Cadastrados</div>
          </div>
          <div class="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
            <div class="text-4xl font-bold text-green-600 mb-2">{formatNumber(stats.totalTransfers)}</div>
            <div class="text-lg font-medium text-green-800">Transferências Realizadas</div>
          </div>
          <div class="text-center bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-8">
            <div class="text-4xl font-bold text-amber-600 mb-2">{formatCurrency(stats.totalBalance)}</div>
            <div class="text-lg font-medium text-amber-800">Volume Total</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Options -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
        <h3 class="text-xl font-bold text-gray-900">Exportar Relatórios</h3>
        <p class="text-gray-600 mt-1">Gere relatórios em diferentes formatos</p>
      </div>
      <div class="p-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button class="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Relatório PDF</h4>
              <p class="text-sm text-gray-600">Exportar dados em PDF</p>
            </div>
          </button>
          
          <button class="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Relatório Excel</h4>
              <p class="text-sm text-gray-600">Exportar dados em Excel</p>
            </div>
          </button>
          
          <button class="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Gráficos</h4>
              <p class="text-sm text-gray-600">Visualizar gráficos</p>
            </div>
          </button>
          
          <button class="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Relatório Mensal</h4>
              <p class="text-sm text-gray-600">Gerar relatório mensal</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
