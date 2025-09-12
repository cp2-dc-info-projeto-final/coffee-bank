<script>
  import { onMount } from 'svelte';

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
</script>

<svelte:head>
  <title>Gerenciar Administradores - Coffee Bank Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Gerenciar Administradores</h1>
      <p class="mt-2 text-gray-600">Crie, edite e gerencie administradores do sistema</p>
    </div>
    <button
      on:click={openCreateModal}
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
    >
      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      Novo Administrador
    </button>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      {error}
    </div>
  {/if}

  <!-- Admins Table -->
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    {#if isLoading}
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    {:else if admins.length === 0}
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum administrador encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Comece criando um novo administrador.</p>
      </div>
    {:else}
      <ul class="divide-y divide-gray-200">
        {#each admins as admin}
          <li class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span class="text-purple-600 font-medium text-sm">
                      {admin.Nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{admin.Nome}</div>
                  <div class="text-sm text-gray-500">CPF: {admin.CPF}</div>
                  <div class="text-sm text-gray-500">
                    Criado em: {formatDate(admin.DataCriacao)}
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  on:click={() => openEditModal(admin)}
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Editar
                </button>
                <button
                  on:click={() => confirmDelete(admin)}
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
</div>

<!-- Create Modal -->
{#if showCreateModal}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Novo Administrador</h3>
        <form on:submit|preventDefault={createAdmin} class="space-y-4">
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="nome"
              type="text"
              bind:value={formData.Nome}
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="Nome completo"
              required
            />
          </div>
          <div>
            <label for="cpf" class="block text-sm font-medium text-gray-700">CPF</label>
            <input
              id="cpf"
              type="text"
              bind:value={formData.CPF}
              on:input={handleCPFInput}
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="000.000.000-00"
              maxlength="14"
              required
            />
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              on:click={cancelModal}
              class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- Edit Modal -->
{#if showEditModal && adminToEdit}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Editar Administrador</h3>
        <form on:submit|preventDefault={updateAdmin} class="space-y-4">
          <div>
            <label for="edit-nome" class="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="edit-nome"
              type="text"
              bind:value={formData.Nome}
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="Nome completo"
              required
            />
          </div>
          <div>
            <label for="edit-cpf" class="block text-sm font-medium text-gray-700">CPF</label>
            <input
              id="edit-cpf"
              type="text"
              value={adminToEdit.CPF}
              class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100"
              disabled
            />
            <p class="mt-1 text-xs text-gray-500">CPF não pode ser alterado</p>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              on:click={cancelModal}
              class="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && adminToDelete}
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
            Tem certeza que deseja excluir o administrador <strong>{adminToDelete.Nome}</strong>?
            Esta ação não pode ser desfeita.
          </p>
        </div>
        <div class="items-center px-4 py-3">
          <button
            on:click={deleteAdmin}
            class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Excluir
          </button>
          <button
            on:click={cancelModal}
            class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
