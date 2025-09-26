<script lang="ts">
  import defaultImage from "../assets/images/defaultUser.jpg";
  import { onMount } from 'svelte';
	import api from '$lib/api';
  import { goto } from '$app/navigation';
	import axios from 'axios';
	import User from "../Class/User";

  type User = {
    id: number;
    Nome: string;
    CPF: string;
    ChavePix: string;
    Image: string;
    Saldo: number;
    DataCriacao: string;
  };
  
  let excluindo = {};
  let users: User[] = [];
  let error = '';
  let loading = true;
  let deletingId: number | null = null;

  function deleteorder(id: Number): void {
    if (excluindo[id]) {
      excluindo[id] = false;
    } else {
      excluindo[id] = true;
    }
  }

  async function handleDelete(id: number) {
    deletingId = id;
    error = '';
    try {
      await api.delete(`/users/${id}`);
      users = users.filter(user => user.id !== id);
    } catch (e) {
      error = 'Erro ao remover usuário.';
    } finally {
      deletingId = null;
    }
  }

  onMount(async () => {
    try {
      const res = await api.get('/users');
      allUsers = res.data.data;
      users = allUsers;
      for (let x = 0; x < users.length; x++) {
        excluindo[users[x].id] = false;
      }
      console.log(users);
    } catch (e) {
      error = 'Erro ao carregar usuários';
    } finally {
      loading = false;
    }
  });

  let searchFilter = "";
  let searchTimeout: NodeJS.Timeout;
  let allUsers: User[] = [];
  let searchType = "all"; // "all", "cpf", "name"
  
  // Busca em tempo real com debounce
  async function performSearch(query: string) {
    if (!query.trim()) {
      users = allUsers;
      return;
    }

    loading = true;
    
    try {
      // Busca por nome (letras)
      if (isNaN(Number(query.replace(/\D/g, '')))) {
        const filteredUsers = allUsers.filter(user => 
          user.Nome.toLowerCase().includes(query.toLowerCase())
        );
        users = filteredUsers;
      } 
      // Busca por CPF (números)
      else {
        const cleanQuery = query.replace(/\D/g, '');
        if (cleanQuery.length >= 3) {
          const filteredUsers = allUsers.filter(user => 
            user.CPF.replace(/\D/g, '').includes(cleanQuery)
          );
          users = filteredUsers;
        } else {
          users = allUsers;
        }
      }
    } catch (e) {
      error = 'Erro ao buscar usuários';
      users = [];
    } finally {
      loading = false;
    }
  }

  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchFilter = target.value;
    
    // Limpar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Debounce de 300ms para evitar muitas requisições
    searchTimeout = setTimeout(() => {
      performSearch(searchFilter);
    }, 300);
  }

  function clearSearch() {
    searchFilter = "";
    users = allUsers;
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
</script>
<div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
  <!-- Search Section -->
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Buscar Usuários</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">Encontre usuários por nome ou CPF</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {users.length} usuário{users.length !== 1 ? 's' : ''}
        </span>
        {#if searchFilter}
          <button 
            on:click={clearSearch}
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110"
            title="Limpar busca"
          >
            <i class="fa-solid fa-times text-sm"></i>
          </button>
        {/if}
      </div>
    </div>
    
    <div class="relative">
      <label for="search-input" class="sr-only">Pesquisar usuários</label>
      <div class="relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i class="fa-solid fa-search text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200"></i>
        </div>
        <input 
          type="text" 
          id="search-input" 
          bind:value={searchFilter} 
          on:input={handleSearchInput}
          class="block w-full pl-12 pr-12 py-4 text-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500 group" 
          placeholder="Digite o nome ou CPF para pesquisar..."
        />
        {#if searchFilter}
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        {/if}
      </div>
      
      <!-- Indicador de tipo de busca -->
      {#if searchFilter}
        <div class="mt-2 flex items-center space-x-2 animate-fade-in">
          <div class="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
            {#if isNaN(Number(searchFilter.replace(/\D/g, '')))}
              <i class="fa-solid fa-user text-xs"></i>
              <span>Busca por nome</span>
            {:else}
              <i class="fa-solid fa-id-card text-xs"></i>
              <span>Busca por CPF</span>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
  
  <div class="p-8">

    <!-- Error Message -->
    {#if error}
      <div class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium">{error}</span>
        </div>
      </div>
    {/if}

    <!-- Loading State -->
    {#if loading}
      <div class="flex items-center justify-center py-12 animate-fade-in">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p class="text-blue-600 font-medium animate-pulse">Buscando usuários...</p>
        </div>
      </div>
    {:else if users.length === 0}
      <!-- Empty State -->
      <div class="text-center py-12 animate-fade-in">
        <div class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <i class="fa-solid fa-users text-2xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {searchFilter ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {searchFilter ? 'Tente ajustar sua busca ou limpe o filtro para ver todos os usuários.' : 'Não há usuários cadastrados no sistema.'}
        </p>
        {#if searchFilter}
          <button 
            on:click={clearSearch}
            class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105"
          >
            <i class="fa-solid fa-refresh text-sm"></i>
            <span>Limpar busca</span>
          </button>
        {/if}
      </div>
    {:else}
      <!-- Users Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each users as user, i}
          {#if excluindo[user.id]}
            <!-- Delete Confirmation -->
            <div class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl p-8 text-center animate-fade-in-up" style="animation-delay: {i * 0.1}s;">
              <div class="w-16 h-16 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <i class="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400 text-2xl"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirmar Exclusão</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">Tem certeza que deseja excluir <strong class="text-red-600 dark:text-red-400">{user.Nome}</strong>?</p>
              <div class="flex space-x-4">
                <button 
                  on:click={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                  class="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  {deletingId === user.id ? 'Excluindo...' : 'Sim, Excluir'}
                </button>
                <button 
                  on:click={() => deleteorder(user.id)}
                  class="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                >
                  Cancelar
                </button>
              </div>
            </div>
          {:else}
            <!-- User Card -->
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate-fade-in-up" style="animation-delay: {i * 0.1}s;">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 relative group">
                  <img 
                    src={user.Image || defaultImage} 
                    alt={user.Nome}
                    class="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 transition-all duration-300 group-hover:scale-110"
                  />
                  <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-lg font-bold text-gray-900 dark:text-white truncate mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{user.Nome}</h4>
                  <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p class="flex items-center space-x-2">
                      <i class="fa-solid fa-id-card text-blue-500 text-xs"></i>
                      <span><span class="font-medium">CPF:</span> {user.CPF}</span>
                    </p>
                    <p class="flex items-center space-x-2">
                      <i class="fa-solid fa-qrcode text-green-500 text-xs"></i>
                      <span><span class="font-medium">PIX:</span> {user.ChavePix}</span>
                    </p>
                    <p class="flex items-center space-x-2">
                      <i class="fa-solid fa-wallet text-purple-500 text-xs"></i>
                      <span><span class="font-medium">Saldo:</span> <span class="text-green-600 dark:text-green-400 font-bold">{formatCurrency(user.Saldo)}</span></span>
                    </p>
                    <p class="flex items-center space-x-2">
                      <i class="fa-solid fa-calendar text-orange-500 text-xs"></i>
                      <span><span class="font-medium">Criado:</span> {formatDate(user.DataCriacao)}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    on:click={() => goto(`/form/${user.id}`)}
                    class="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 hover:scale-110 group"
                    title="Editar usuário"
                  >
                    <i class="fa-solid fa-edit group-hover:rotate-12 transition-transform duration-200"></i>
                  </button>
                  <button
                    on:click={() => deleteorder(user.id)}
                    class="p-2 text-red-600 hover:text-red-800 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 hover:scale-110 group"
                    title="Excluir usuário"
                  >
                    <i class="fa-solid fa-trash group-hover:rotate-12 transition-transform duration-200"></i>
                  </button>
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Animações sutis */
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
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
</style>