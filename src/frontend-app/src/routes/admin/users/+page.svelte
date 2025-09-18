<script>
  import UserList from '../../../Components/userList.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let users = [];
  let isLoading = true;
  let error = '';
  let searchTerm = '';
  let currentPage = 1;
  let totalPages = 1;
  let totalUsers = 0;
  let showDeleteModal = false;
  let userToDelete = null;

  onMount(() => {
    loadUsers();
  });

  async function loadUsers() {
    try {
      isLoading = true;
      const params = new URLSearchParams({
        search: searchTerm,
        limit: '20',
        offset: ((currentPage - 1) * 20).toString()
      });

      const response = await fetch(`http://localhost:3000/admin/users?${params}`);
      const data = await response.json();
      console.log(data)

      if (data.success) {
        users = data.data;
        totalPages = data.pagination.pages;
        totalUsers = data.pagination.total;
      } else {
        error = 'Erro ao carregar usuários';
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      error = 'Erro de conexão';
    } finally {
      isLoading = false;
    }
  }

  function handleSearch() {
    currentPage = 1;
    loadUsers();
  }

  function handlePageChange(page) {
    currentPage = page;
    loadUsers();
  }

  function confirmDelete(user) {
    userToDelete = user;
    showDeleteModal = true;
  }

  async function deleteUser() {
    if (!userToDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/admin/users/${userToDelete.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // Recarregar lista
        loadUsers();
        showDeleteModal = false;
        userToDelete = null;
      } else {
        error = data.message || 'Erro ao excluir usuário';
      }
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      error = 'Erro de conexão';
    }
  }

  function cancelDelete() {
    showDeleteModal = false;
    userToDelete = null;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function goBack() {
    goto('/admin');
  }
</script>

<svelte:head>
  <title>Gerenciar Usuários - Coffee Bank Admin</title>
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
          <h1 class="text-4xl font-bold mb-2">Gerenciar Usuários</h1>
          <p class="text-[#0b8185] text-lg">Visualize e gerencie todos os usuários do sistema</p>
        </div>
      </div>
      <div class="hidden md:block">
        <div class="bg-white/20 rounded-2xl p-4 text-center">
          <div class="text-2xl font-bold">{totalUsers}</div>
          <div class="text-[#0b8185] text-sm">Total de Usuários</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Search and Filters -->
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
      <h3 class="text-xl font-bold text-gray-900">Buscar Usuários</h3>
      <p class="text-gray-600 mt-1">Encontre usuários por nome ou CPF</p>
    </div>
    <div class="p-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Buscar usuários</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              id="search"
              type="text"
              bind:value={searchTerm}
              on:keydown={(e) => e.key === 'Enter' && handleSearch()}
              class="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#0b8185] focus:border-[#0b8185] text-lg"
              placeholder="Buscar por nome ou CPF..."
            />
          </div>
        </div>
        <button
          on:click={handleSearch}
          class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-[#0b8185] hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b8185] transition-colors duration-200"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          Buscar
        </button>
      </div>
    </div>
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-md">
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="font-semibold">Erro</h3>
          <p class="text-sm">{error}</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Users Table -->
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    {#if isLoading}
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0b8185] mx-auto mb-4"></div>
        <p class="text-[#0b8185] font-medium text-lg">Carregando usuários...</p>
        </div>
      </div>
    {:else if users.length === 0}
      <div class="text-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</h3>
        <p class="text-gray-600">Tente ajustar os filtros de busca ou verifique se há usuários cadastrados.</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each users as user}
              <tr class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-[#0b8185] to-[#1f5f61] flex items-center justify-center">
                        <span class="text-white font-bold text-lg">
                          {user.Nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-lg font-semibold text-gray-900">{user.Nome}</div>
                      <div class="text-sm text-gray-500">
                        {user.Sex ? 'Masculino' : 'Feminino'}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{user.CPF}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-lg font-bold text-green-600">{formatCurrency(user.Saldo)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{formatDate(user.DataCriacao)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    on:click={() => confirmDelete(user)}
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Excluir
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>

  <!-- Pagination -->
  {#if totalPages > 1}
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            on:click={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            on:click={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{(currentPage - 1) * 20 + 1}</span>
              até <span class="font-medium">{Math.min(currentPage * 20, totalUsers)}</span>
              de <span class="font-medium">{totalUsers}</span> resultados
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
              <button
                on:click={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                class="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              </button>
              
              {#each Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + 4);
                const page = start + i;
                return page <= end ? page : null;
              }).filter(Boolean) as page}
                <button
                  on:click={() => handlePageChange(page)}
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium {page === currentPage ? 'z-10 bg-[#0b8185]/10 border-[#0b8185] text-[#0b8185]' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}"
                >
                  {page}
                </button>
              {/each}
              
              <button
                on:click={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                class="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && userToDelete}
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div class="p-8">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Confirmar Exclusão</h3>
          <p class="text-gray-600 mb-8">
            Tem certeza que deseja excluir o usuário <strong class="text-gray-900">{userToDelete.Nome}</strong>?
            <br><br>
            <span class="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
          </p>
          <div class="flex space-x-4">
            <button
              on:click={cancelDelete}
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              on:click={deleteUser}
              class="flex-1 px-6 py-3 bg-red-600 text-white text-lg font-medium rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}