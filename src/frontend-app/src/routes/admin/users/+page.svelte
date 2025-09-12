<script>
  import UserList from '../../../Components/userList.svelte';
  import { onMount } from 'svelte';
  

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
</script>

<svelte:head>
  <title>Gerenciar Usuários - Coffee Bank Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
      <p class="mt-2 text-gray-600">Visualize e gerencie todos os usuários do sistema</p>
    </div>
    <div class="text-sm text-gray-500">
      Total: {totalUsers} usuários
    </div>
  </div>
  <!--<div class="bg-white p-6 rounded-lg shadow">
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label for="search" class="sr-only">Buscar usuários</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            id="search"
            type="text"
            bind:value={searchTerm}
            on:keydown={(e) => e.key === 'Enter' && handleSearch()}
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            placeholder="Buscar por nome ou CPF..."
          />
        </div>
      </div>
      <button
        on:click={handleSearch}
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        Buscar
      </button>
    </div>
  </div>-->
  <UserList />
  <!-- Search and Filters -->
</div>

  <!-- {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {error}
    </div>
  {/if}

   Users Table 
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    {#if isLoading}
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    {:else if users.length === 0}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Tente ajustar os filtros de busca.</p>
      </div>
    {:else}
      <ul class="divide-y divide-gray-200">
        {#each users as user}
          <li class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                 
                  <div class="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <span class="text-amber-600 font-medium text-sm">
                      {user.Nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{user.Nome}</div>
                  <div class="text-sm text-gray-500">CPF: {user.CPF}</div>
                  <div class="text-sm text-gray-500">
                    Criado em: {formatDate(user.DataCriacao)}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">
                    {formatCurrency(user.Saldo)}
                  </div>
                  <div class="text-sm text-gray-500">
                    {user.Sex ? 'Masculino' : 'Feminino'}
                  </div>
                </div>
                <button
                  on:click={() => confirmDelete(user)}
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Excluir
                </button>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

   Pagination 
  {#if totalPages > 1}
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          on:click={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          on:click={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              on:click={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium {page === currentPage ? 'z-10 bg-amber-50 border-amber-500 text-amber-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}"
              >
                {page}
              </button>
            {/each}
            
            <button
              on:click={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  {/if}
</div>

 Delete Confirmation Modal 
{#if showDeleteModal && userToDelete}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mt-4">Confirmar Exclusão</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            Tem certeza que deseja excluir o usuário <strong>{userToDelete.Nome}</strong>?
            Esta ação não pode ser desfeita.
          </p>
        </div>
        <div class="items-center px-4 py-3">
          <button
            on:click={deleteUser}
            class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Excluir
          </button>
          <button
            on:click={cancelDelete}
            class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
-->