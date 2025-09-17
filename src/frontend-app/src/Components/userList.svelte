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
    Sex: boolean;
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
      users = res.data.data;
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

  let CPFFilter = "";
  
  async function search(cpf: string) {
    if (cpf) {
      try {
        loading = true;
        let req = await axios.put("http://localhost:3000/users/search", {"CPF": cpf});
        users = req.data.data;
        loading = false;
      } catch (e) {
        users = [];
      }
    } else {
      try {
        const res = await api.get('/users');
        users = res.data.data;
      } catch (e) {
        error = 'Erro ao carregar usuários';  
      }
    }
  }

  function CPFTransformer(event: Event) {
    CPFFilter = event.target.value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    search(CPFFilter);
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
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
    <h3 class="text-xl font-bold text-gray-900 mb-2">Buscar Usuários</h3>
    <p class="text-gray-600 text-sm">Encontre usuários por CPF</p>
  </div>
  
  <div class="p-8">
    <div class="relative mb-6">
      <label for="default-search" class="sr-only">Pesquisar usuários</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input 
          type="search" 
          id="default-search" 
          bind:value={CPFFilter} 
          on:input={CPFTransformer}
          class="block w-full pl-12 pr-4 py-4 text-lg text-gray-700 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
          placeholder="Digite o CPF para pesquisar..."
        />
      </div>
    </div>

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
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p class="text-blue-600 font-medium">Carregando usuários...</p>
        </div>
      </div>
    {:else if users.length === 0}
      <!-- Empty State -->
      <div class="text-center py-12">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</h3>
        <p class="text-gray-600">Tente ajustar sua busca ou verifique se há usuários cadastrados.</p>
      </div>
    {:else}
      <!-- Users Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each users as user, i}
          {#if excluindo[user.id]}
            <!-- Delete Confirmation -->
            <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-4">Confirmar Exclusão</h3>
              <p class="text-gray-600 mb-6">Tem certeza que deseja excluir <strong>{user.Nome}</strong>?</p>
              <div class="flex space-x-4">
                <button 
                  on:click={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                  class="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deletingId === user.id ? 'Excluindo...' : 'Sim, Excluir'}
                </button>
                <button 
                  on:click={() => deleteorder(user.id)}
                  class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          {:else}
            <!-- User Card -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <img 
                    src={user.Image || defaultImage} 
                    alt={user.Nome}
                    class="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-lg font-bold text-gray-900 truncate mb-2">{user.Nome}</h4>
                  <div class="space-y-1 text-sm text-gray-600">
                    <p><span class="font-medium">CPF:</span> {user.CPF}</p>
                    <p><span class="font-medium">PIX:</span> {user.ChavePix}</p>
                    <p><span class="font-medium">Saldo:</span> <span class="text-green-600 font-bold">{formatCurrency(user.Saldo)}</span></p>
                    <p><span class="font-medium">Criado:</span> {formatDate(user.DataCriacao)}</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.Sex ? 'Masculino' : 'Feminino'}
                  </span>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    on:click={() => goto(`/form/${user.id}`)}
                    class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar usuário"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    on:click={() => deleteorder(user.id)}
                    class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir usuário"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
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