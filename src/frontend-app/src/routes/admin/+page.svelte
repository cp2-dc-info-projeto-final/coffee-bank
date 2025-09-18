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
</script>

<svelte:head>
  <title>Dashboard - Coffee Bank Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h1 class="text-x font-bold bg-gradient-to-r from-orange-700 via-orange-800 to-orange-500 bg-clip-text text-transparent text-5xl font-black">Dashboard</h1>
    <p class="mt-2 text-red-50">Visão geral do sistema Coffee Bank</p>
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
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <dd class="text-lg font-medium text-gray-900">{formatNumber(stats.totalUsers)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-green-600 font-medium">+{stats.todayUsers}</span>
            <span class="text-gray-500"> hoje</span>
          </div>
        </div>
      </div>

      <!-- Total de Administradores -->
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
                <dd class="text-lg font-medium text-gray-900">{formatNumber(stats.totalAdmins)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm text-gray-500">
            Acesso administrativo
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
                <dd class="text-lg font-medium text-gray-900">{formatNumber(stats.totalTransfers)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <span class="text-green-600 font-medium">+{stats.todayTransfers}</span>
            <span class="text-gray-500"> hoje</span>
          </div>
        </div>
      </div>

      <!-- Saldo Total do Sistema -->
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
                <dd class="text-lg font-medium text-gray-900">{formatCurrency(stats.totalBalance)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm text-gray-500">
            Em cafés no sistema
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Ações Rápidas</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="/admin/users" 
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true"></span>
                Gerenciar Usuários
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Visualizar, buscar e gerenciar usuários do sistema
              </p>
            </div>
          </a>

          <a 
            href="/admin/admins" 
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true"></span>
                Gerenciar Admins
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Criar, editar e excluir administradores
              </p>
            </div>
          </a>

          <a 
            href="/admin/reports" 
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true"></span>
                Relatórios
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Visualizar relatórios e análises do sistema
              </p>
            </div>
          </a>

          <button 
            on:click={loadStats}
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-amber-50 text-amber-700 ring-4 ring-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium">
                Atualizar Dados
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Recarregar estatísticas do sistema
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
