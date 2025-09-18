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

<div class="min-h-screen">
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
    </div>
  {:else if !adminData}
    <slot />
  {:else}
    <!-- Sidebar -->
    <div class="flex">
      <div class="w-64 bg-amber-800 text-white min-h-screen">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-amber-100">Coffee Bank</h1>
          <p class="text-amber-200 text-sm">Painel Administrativo</p>
        </div>
        
        <nav class="mt-8">
          <a href="/admin" class="flex items-center px-6 py-3 text-amber-100 hover:bg-amber-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
            </svg>
            <h1 class="mb-4 md:text-6xl font-extrabold leading-none tracking-tight text-gray-200 text-3xl  text-center">CoffeeBank</h1>
          </a>
          
          <a href="/admin/users" class="flex items-center px-6 py-3 text-amber-100 hover:bg-amber-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            Gerenciar Usuários
          </a>
          
          <a href="/admin/admins" class="flex items-center px-6 py-3 text-amber-100 hover:bg-amber-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            Gerenciar Admins
          </a>
          
          <a href="/admin/reports" class="flex items-center px-6 py-3 text-amber-100 hover:bg-amber-700 transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Relatórios
          </a>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="px-6 py-4 flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-800">Painel Administrativo</h2>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">Bem-vindo, {adminData.Nome}</span>
              <button 
                on:click={logout}
                class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-6">
          <slot />
        </main>
      </div>
    </div>
  {/if}
</div>
