<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let adminData = null;
  let isLoading = true;

  onMount(() => {
    // Verificar se há dados de admin no localStorage
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      adminData = JSON.parse(storedAdmin);
    }
    isLoading = false;
  });

  function logout() {
    localStorage.removeItem('adminData');
    adminData = null;
    goto('/admin/login');
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p class="text-blue-600 font-medium">Carregando...</p>
      </div>
    </div>
  {:else if !adminData}
    <slot />
  {:else}
    <!-- Sidebar -->
    <div class="flex">
      <div class="w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white min-h-screen shadow-2xl">
        <!-- Logo Section -->
        <div class="p-8 border-b border-blue-700">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Coffee Bank</h1>
              <p class="text-blue-200 text-sm font-medium">Painel Administrativo</p>
            </div>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="mt-8 px-4">
          <a href="/admin" class="flex items-center px-6 py-4 text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200 rounded-xl mb-2 group">
            <svg class="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
            </svg>
            <span class="font-medium">Dashboard</span>
          </a>
          
          <a href="/admin/users" class="flex items-center px-6 py-4 text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200 rounded-xl mb-2 group">
            <svg class="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <span class="font-medium">Gerenciar Usuários</span>
          </a>
          
          <a href="/admin/admins" class="flex items-center px-6 py-4 text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200 rounded-xl mb-2 group">
            <svg class="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="font-medium">Gerenciar Admins</span>
          </a>
          
          <a href="/admin/reports" class="flex items-center px-6 py-4 text-blue-100 hover:bg-blue-700 hover:text-white transition-all duration-200 rounded-xl mb-2 group">
            <svg class="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span class="font-medium">Relatórios</span>
          </a>
        </nav>

        <!-- Admin Info -->
        <div class="absolute bottom-8 left-0 right-0 px-8">
          <div class="bg-blue-700 rounded-xl p-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">{adminData.Nome ? adminData.Nome.charAt(0).toUpperCase() : 'A'}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{adminData.Nome}</p>
                <p class="text-xs text-blue-200">Administrador</p>
              </div>
              <button 
                on:click={logout}
                class="p-2 text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
                title="Sair"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div class="px-8 py-6 flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">Painel Administrativo</h2>
              <p class="text-gray-600 mt-1">Gerencie o sistema Coffee Bank</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-700">Bem-vindo, {adminData.Nome}</p>
                <p class="text-xs text-gray-500">Último acesso: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-8">
          <slot />
        </main>
      </div>
    </div>
  {/if}
</div>
