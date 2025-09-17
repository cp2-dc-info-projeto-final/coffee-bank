<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let admins = [];
  let isLoading = true;
  let error = '';
  let showCreateModal = false;
  let showEditModal = false;
  let showDeleteModal = false;
  let adminToEdit = null;
  let adminToDelete = null;
  let newPassword = '';

  // Form data
  let formData = {
    Nome: '',
    CPF: ''
  };

  onMount(() => {
    loadAdmins();
  });

  async function loadAdmins() {
    try {
      isLoading = true;
      const response = await fetch('http://localhost:3000/admin');
      const data = await response.json();

      if (data.success) {
        admins = data.data;
      } else {
        error = 'Erro ao carregar administradores';
      }
    } catch (err) {
      console.error('Erro ao carregar admins:', err);
      error = 'Erro de conexão';
    } finally {
      isLoading = false;
    }
  }

  function openCreateModal() {
    formData = { Nome: '', CPF: '' };
    showCreateModal = true;
  }

  function openEditModal(admin) {
    adminToEdit = admin;
    formData = { Nome: admin.Nome, CPF: admin.CPF };
    showEditModal = true;
  }

  function confirmDelete(admin) {
    adminToDelete = admin;
    showDeleteModal = true;
  }

  async function createAdmin() {
    if (!formData.Nome || !formData.CPF) {
      error = 'Todos os campos são obrigatórios';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        newPassword = data.data.senhaGerada;
        showCreateModal = false;
        loadAdmins();
        // Mostrar senha gerada em um alert
        alert(`Administrador criado com sucesso!\n\nSenha gerada: ${data.data.senhaGerada}\n\nIMPORTANTE: Anote esta senha, ela não será exibida novamente.`);
      } else {
        error = data.message || 'Erro ao criar administrador';
      }
    } catch (err) {
      console.error('Erro ao criar admin:', err);
      error = 'Erro de conexão';
    }
  }

  async function updateAdmin() {
    if (!formData.Nome) {
      error = 'Nome é obrigatório';
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/admin/${adminToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showEditModal = false;
        adminToEdit = null;
        loadAdmins();
      } else {
        error = data.message || 'Erro ao atualizar administrador';
      }
    } catch (err) {
      console.error('Erro ao atualizar admin:', err);
      error = 'Erro de conexão';
    }
  }

  async function deleteAdmin() {
    if (!adminToDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/admin/${adminToDelete.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        showDeleteModal = false;
        adminToDelete = null;
        loadAdmins();
      } else {
        error = data.message || 'Erro ao excluir administrador';
      }
    } catch (err) {
      console.error('Erro ao excluir admin:', err);
      error = 'Erro de conexão';
    }
  }

  function cancelModal() {
    showCreateModal = false;
    showEditModal = false;
    showDeleteModal = false;
    adminToEdit = null;
    adminToDelete = null;
    formData = { Nome: '', CPF: '' };
    error = '';
  }

  function formatCPF(value) {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  function handleCPFInput(event) {
    formData.CPF = formatCPF(event.target.value);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  function goBack() {
    goto('/admin');
  }
</script>

<svelte:head>
  <title>Gerenciar Administradores - Coffee Bank Admin</title>
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
          <h1 class="text-4xl font-bold mb-2">Gerenciar Administradores</h1>
          <p class="text-[#0b8185] text-lg">Crie, edite e gerencie administradores do sistema</p>
        </div>
      </div>
      <div class="hidden md:flex items-center space-x-4">
        <div class="bg-white/20 rounded-2xl p-4 text-center">
          <div class="text-2xl font-bold">{admins.length}</div>
          <div class="text-[#0b8185] text-sm">Total de Admins</div>
        </div>
        <button
          on:click={openCreateModal}
          class="inline-flex items-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-[#0b8185] bg-white hover:bg-[#0b8185]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors duration-200"
        >
          <svg class="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Novo Administrador
        </button>
      </div>
    </div>
  </div>

  <div class="md:hidden">
    <button
      on:click={openCreateModal}
      class="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-[#0b8185] hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b8185] transition-colors duration-200"
    >
      <svg class="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      Novo Administrador
    </button>
  </div>

  <!-- Mensagem De Erro -->
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

  <!-- Admins Table -->
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
    {#if isLoading}
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0b8185] mx-auto mb-4"></div>
        <p class="text-[#0b8185] font-medium text-lg">Carregando administradores...</p>
        </div>
      </div>
    {:else if admins.length === 0}
      <div class="text-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum administrador encontrado</h3>
        <p class="text-gray-600 mb-6">Comece criando um novo administrador para gerenciar o sistema.</p>
        <button
          on:click={openCreateModal}
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#0b8185] hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b8185] transition-colors duration-200"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Criar Primeiro Administrador
        </button>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrador</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each admins as admin}
              <tr class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <div class="h-12 w-12 rounded-full bg-gradient-to-br from-[#0b8185] to-[#1f5f61] flex items-center justify-center">
                        <span class="text-white font-bold text-lg">
                          {admin.Nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-lg font-semibold text-gray-900">{admin.Nome}</div>
                      <div class="text-sm text-gray-500">Administrador</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{admin.CPF}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{formatDate(admin.DataCriacao)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-3">
                    <button
                      on:click={() => openEditModal(admin)}
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Editar
                    </button>
                    <button
                      on:click={() => confirmDelete(admin)}
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<!-- Criar Modal -->
{#if showCreateModal}
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div class="p-8">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#0b8185]/10 mb-4">
            <svg class="h-8 w-8 text-[#0b8185]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Novo Administrador</h3>
          <p class="text-gray-600 mt-2">Crie um novo administrador para o sistema</p>
        </div>
        
        <form on:submit|preventDefault={createAdmin} class="space-y-6">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              id="nome"
              type="text"
              bind:value={formData.Nome}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#0b8185] focus:border-[#0b8185] transition-colors"
              placeholder="Digite o nome completo"
              required
            />
          </div>
          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              id="cpf"
              type="text"
              bind:value={formData.CPF}
              on:input={handleCPFInput}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#0b8185] focus:border-[#0b8185] transition-colors"
              placeholder="000.000.000-00"
              maxlength="14"
              required
            />
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button
              type="button"
              on:click={cancelModal}
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-[#0b8185] text-white text-lg font-medium rounded-xl hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-[#0b8185]/30 transition-colors duration-200"
            >
              Criar Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- Editar Modal -->
{#if showEditModal && adminToEdit}
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div class="p-8">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#0b8185]/10 mb-4">
            <svg class="h-8 w-8 text-[#0b8185]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Editar Administrador</h3>
          <p class="text-gray-600 mt-2">Atualize as informações do administrador</p>
        </div>
        
        <form on:submit|preventDefault={updateAdmin} class="space-y-6">
          <div>
            <label for="edit-nome" class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              id="edit-nome"
              type="text"
              bind:value={formData.Nome}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#0b8185] focus:border-[#0b8185] transition-colors"
              placeholder="Digite o nome completo"
              required
            />
          </div>
          <div>
            <label for="edit-cpf" class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              id="edit-cpf"
              type="text"
              value={adminToEdit.CPF}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg bg-gray-100"
              disabled
            />
            <p class="mt-2 text-sm text-gray-500">O CPF não pode ser alterado após a criação</p>
          </div>
          
          <div class="flex space-x-4 pt-4">
            <button
              type="button"
              on:click={cancelModal}
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-[#0b8185] text-white text-lg font-medium rounded-xl hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-[#0b8185]/30 transition-colors duration-200"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- Confirmação De Deleção -->
{#if showDeleteModal && adminToDelete}
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
            Tem certeza que deseja excluir o administrador <strong class="text-gray-900">{adminToDelete.Nome}</strong>?
            <br><br>
            <span class="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
          </p>
          <div class="flex space-x-4">
            <button
              on:click={cancelModal}
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              on:click={deleteAdmin}
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
