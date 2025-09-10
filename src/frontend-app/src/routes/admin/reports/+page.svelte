<script>
  import { onMount } from 'svelte';

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
</script>

<svelte:head>
  <title>Relatórios - Coffee Bank Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
      <p class="mt-2 text-gray-600">Visão detalhada do sistema Coffee Bank</p>
    </div>
    <button
      on:click={loadStats}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
    >
      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      Atualizar
    </button>
  </div>

  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {error}
    </div>
  {:else}
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total de Usuários -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
                <dd class="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-blue-600 font-medium">+{stats.todayUsers}</span>
            <span class="text-gray-500"> novos hoje</span>
          </div>
        </div>
      </div>

      <!-- Total de Transferências -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Transferências</dt>
                <dd class="text-2xl font-bold text-gray-900">{formatNumber(stats.totalTransfers)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-green-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-green-600 font-medium">+{stats.todayTransfers}</span>
            <span class="text-gray-500"> hoje</span>
          </div>
        </div>
      </div>

      <!-- Saldo Total -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Saldo Total</dt>
                <dd class="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBalance)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-amber-50 px-5 py-3">
          <div class="text-sm text-gray-500">
            Em cafés no sistema
          </div>
        </div>
      </div>

      <!-- Administradores -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Administradores</dt>
                <dd class="text-2xl font-bold text-gray-900">{formatNumber(stats.totalAdmins)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-purple-50 px-5 py-3">
          <div class="text-sm text-gray-500">
            Acesso administrativo
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Reports -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Activity Summary -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Resumo de Atividade</h3>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Novos usuários hoje</dt>
              <dd class="mt-1 text-sm text-gray-900">{stats.todayUsers}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Transferências hoje</dt>
              <dd class="mt-1 text-sm text-gray-900">{stats.todayTransfers}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Taxa de crescimento diário</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {formatPercentage(stats.todayUsers, stats.totalUsers)}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Atividade de transferências</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {formatPercentage(stats.todayTransfers, stats.totalTransfers)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- System Health -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Saúde do Sistema</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Usuários Ativos</span>
                <span>{formatNumber(stats.totalUsers)}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 100%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Transferências Processadas</span>
                <span>{formatNumber(stats.totalTransfers)}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: 100%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Volume Total em Cafés</span>
                <span>{formatCurrency(stats.totalBalance)}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-amber-600 h-2 rounded-full" style="width: 100%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Estatísticas Rápidas</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">{formatNumber(stats.totalUsers)}</div>
            <div class="text-sm text-gray-500">Usuários Cadastrados</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">{formatNumber(stats.totalTransfers)}</div>
            <div class="text-sm text-gray-500">Transferências Realizadas</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-amber-600">{formatCurrency(stats.totalBalance)}</div>
            <div class="text-sm text-gray-500">Volume Total</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Options -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Exportar Relatórios</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Relatório PDF
          </button>
          <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Relatório Excel
          </button>
          <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Gráficos
          </button>
          <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Relatório Mensal
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
