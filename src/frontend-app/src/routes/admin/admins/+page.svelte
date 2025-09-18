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
  let sidebarOpen = false;
  let activeSection = 'overview';

  // Form data
  let formData = {
    Nome: '',
    CPF: ''
  };

  const sections = [
    { id: 'overview', name: 'Visão Geral', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'list', name: 'Lista de Admins', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { id: 'create', name: 'Criar Admin', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
    { id: 'permissions', name: 'Permissões', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'activity', name: 'Atividade', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'settings', name: 'Configurações', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

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

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function setActiveSection(sectionId) {
    activeSection = sectionId;
    if (sectionId === 'create') {
      openCreateModal();
    }
  }
</script>

<svelte:head>
  <title>Gerenciar Administradores - Coffee Bank Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex">
  <!-- Sidebar -->
  <div class="fixed inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-[#1f5f61] to-[#36544f] transform transition-all duration-500 ease-in-out {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 shadow-2xl">
    <div class="flex flex-col h-full">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between p-6 border-b border-white/20">
        <div class="flex items-center space-x-3 animate-fade-in">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white animate-slide-in-left">Administradores</h2>
            <p class="text-[#0b8185] text-sm animate-slide-in-left animation-delay-100">Coffee Bank Admin</p>
          </div>
        </div>
        <button
          on:click={toggleSidebar}
          class="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-110"
          aria-label="Fechar barra lateral"
        >
          <svg class="w-6 h-6 text-white transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        {#each sections as section, index}
          <button
            on:click={() => setActiveSection(section.id)}
            class="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-left transition-all duration-300 hover:scale-105 {activeSection === section.id ? 'bg-white/20 text-white shadow-lg animate-pulse' : 'text-[#0b8185] hover:bg-white/10 hover:text-white'} animate-fade-in-up"
            style="animation-delay: {index * 100}ms"
          >
            <svg class="w-5 h-5 transition-transform duration-300 {activeSection === section.id ? 'scale-110' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{section.icon}"></path>
            </svg>
            <span class="font-medium transition-all duration-300">{section.name}</span>
          </button>
        {/each}
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-6 border-t border-white/20 animate-fade-in-up animation-delay-500">
        <button
          on:click={goBack}
          class="w-full flex items-center space-x-3 px-4 py-3 text-[#0b8185] hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300 hover:scale-105"
        >
          <svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span class="font-medium">Voltar ao Dashboard</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Overlay for mobile -->
  {#if sidebarOpen}
    <div 
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden animate-fade-in" 
      on:click={toggleSidebar}
      on:keydown={(e) => e.key === 'Escape' && toggleSidebar()}
      role="button"
      tabindex="0"
      aria-label="Fechar barra lateral"
    ></div>
  {/if}

  <!-- Main Content -->
  <div class="flex-1 flex flex-col min-h-screen">
    <!-- Top Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 animate-fade-in-down">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              on:click={toggleSidebar}
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
              aria-label="Abrir barra lateral"
            >
              <svg class="w-6 h-6 text-gray-600 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div class="animate-slide-in-right">
              <h1 class="text-2xl font-bold text-gray-900 transition-all duration-500">{sections.find(s => s.id === activeSection)?.name || 'Administradores'}</h1>
              <p class="text-gray-600 transition-all duration-500">Gerenciamento completo de administradores</p>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-[#0b8185]/10 rounded-xl p-4 text-center animate-fade-in-up">
              <div class="text-2xl font-bold text-[#0b8185] animate-count-up">{admins.length}</div>
              <div class="text-[#0b8185] text-sm">Total de Admins</div>
            </div>
    <button
      on:click={openCreateModal}
              class="inline-flex items-center px-4 py-2 bg-[#0b8185] text-white rounded-lg hover:bg-[#1f5f61] transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up"
    >
              <svg class="h-5 w-5 mr-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
              Novo Admin
    </button>
          </div>
        </div>
      </div>
  </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-7xl mx-auto">
        <!-- Error Message -->
  {#if error}
          <div class="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg shadow-md animate-fade-in-up mb-6">
      <div class="flex items-center">
              <svg class="w-6 h-6 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 class="font-semibold">Erro</h3>
          <p class="text-sm">{error}</p>
        </div>
      </div>
    </div>
  {/if}

        <!-- Dynamic Content Based on Active Section -->
        {#if activeSection === 'overview'}
          <!-- Overview Section -->
          <div class="space-y-6 animate-fade-in">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Total de Admins</p>
                    <p class="text-3xl font-bold text-gray-900 animate-count-up">{admins.length}</p>
                  </div>
                  <div class="w-12 h-12 bg-[#0b8185]/10 rounded-lg flex items-center justify-center animate-pulse">
                    <svg class="w-6 h-6 text-[#0b8185] transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-100">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Admins Ativos</p>
                    <p class="text-3xl font-bold text-gray-900 animate-count-up">{admins.length}</p>
                  </div>
                  <div class="w-12 h-12 bg-[#1f5f61]/10 rounded-lg flex items-center justify-center animate-pulse">
                    <svg class="w-6 h-6 text-[#1f5f61] transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-600">Permissões</p>
                    <p class="text-3xl font-bold text-gray-900 animate-count-up">100%</p>
                  </div>
                  <div class="w-12 h-12 bg-[#36544f]/10 rounded-lg flex items-center justify-center animate-pulse">
                    <svg class="w-6 h-6 text-[#36544f] transition-transform duration-300 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Admins -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-300">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Administradores Recentes</h3>
              {#if admins.length > 0}
                <div class="space-y-4">
                  {#each admins.slice(0, 3) as admin}
                    <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#0b8185] to-[#1f5f61] flex items-center justify-center">
                        <span class="text-white font-bold text-sm">{admin.Nome.charAt(0).toUpperCase()}</span>
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-gray-900">{admin.Nome}</p>
                        <p class="text-sm text-gray-500">Criado em {formatDate(admin.DataCriacao)}</p>
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="text-gray-500 text-center py-8">Nenhum administrador encontrado</p>
              {/if}
            </div>
          </div>

        {:else if activeSection === 'list'}
          <!-- List Section -->
          <div class="space-y-6 animate-fade-in">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    {#if isLoading}
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0b8185] mx-auto mb-4"></div>
                    <p class="text-[#0b8185] font-medium text-lg animate-pulse">Carregando administradores...</p>
        </div>
      </div>
    {:else if admins.length === 0}
      <div class="text-center py-20">
                  <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in-up">
          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2 animate-fade-in-up">Nenhum administrador encontrado</h3>
                  <p class="text-gray-600 mb-6 animate-fade-in-up">Comece criando um novo administrador para gerenciar o sistema.</p>
        <button
          on:click={openCreateModal}
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#0b8185] hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b8185] transition-all duration-300 hover:scale-105 animate-fade-in-up"
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
                      {#each admins as admin, index}
                        <tr class="hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up" style="animation-delay: {index * 100}ms">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                                <div class="h-12 w-12 rounded-full bg-gradient-to-br from-[#0b8185] to-[#1f5f61] flex items-center justify-center animate-pulse">
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
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105"
                    >
                      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Editar
                    </button>
                    <button
                      on:click={() => confirmDelete(admin)}
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover:scale-105"
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

        {:else if activeSection === 'permissions'}
          <!-- Permissions Section -->
          <div class="space-y-6 animate-fade-in">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Gerenciamento de Permissões</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-[#0b8185]/5 rounded-lg p-6">
                  <h4 class="font-medium text-[#0b8185] mb-2">Permissões do Sistema</h4>
                  <div class="h-48 bg-gradient-to-br from-[#0b8185]/10 to-[#1f5f61]/10 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-[#0b8185]/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      <p class="text-[#0b8185] font-medium">Controle de Acesso</p>
                    </div>
                  </div>
                </div>
                <div class="bg-[#1f5f61]/5 rounded-lg p-6">
                  <h4 class="font-medium text-[#1f5f61] mb-2">Níveis de Acesso</h4>
                  <div class="h-48 bg-gradient-to-br from-[#1f5f61]/10 to-[#36544f]/10 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-[#1f5f61]/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      <p class="text-[#1f5f61] font-medium">Hierarquia de Usuários</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'activity'}
          <!-- Activity Section -->
          <div class="space-y-6 animate-fade-in">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Atividade dos Administradores</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-[#36544f]/5 rounded-lg p-6">
                  <h4 class="font-medium text-[#36544f] mb-2">Logs de Atividade</h4>
                  <div class="h-48 bg-gradient-to-br from-[#36544f]/10 to-[#1f5f61]/10 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-[#36544f]/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      <p class="text-[#36544f] font-medium">Histórico de Ações</p>
                    </div>
                  </div>
                </div>
                <div class="bg-[#403831]/5 rounded-lg p-6">
                  <h4 class="font-medium text-[#403831] mb-2">Sessões Ativas</h4>
                  <div class="h-48 bg-gradient-to-br from-[#403831]/10 to-[#30261c]/10 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-[#403831]/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <p class="text-[#403831] font-medium">Monitoramento em Tempo Real</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeSection === 'settings'}
          <!-- Settings Section -->
          <div class="space-y-6 animate-fade-in">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Configurações do Sistema</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-[#0b8185]/5 rounded-lg p-6">
                  <h4 class="font-medium text-[#0b8185] mb-2">Configurações Gerais</h4>
                  <div class="h-48 bg-gradient-to-br from-[#0b8185]/10 to-[#1f5f61]/10 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-[#0b8185]/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <p class="text-[#0b8185] font-medium">Configurações do Sistema</p>
                    </div>
                  </div>
                </div>
                <div class="bg-[#1f5f61]/5 rounded-lg p-6">
                  <h4 class="font-medium text-[#1f5f61] mb-2">Segurança</h4>
                  <div class="h-48 bg-gradient-to-br from-[#1f5f61]/10 to-[#36544f]/10 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <svg class="w-12 h-12 text-[#1f5f61]/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <p class="text-[#1f5f61] font-medium">Configurações de Segurança</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
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

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fade-in-up {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes fade-in-down {
    from { 
      opacity: 0; 
      transform: translateY(-20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes slide-in-left {
    from { 
      opacity: 0; 
      transform: translateX(-20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes slide-in-right {
    from { 
      opacity: 0; 
      transform: translateX(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes count-up {
    from { 
      opacity: 0; 
      transform: scale(0.8); 
    }
    to { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out;
  }
  
  .animate-fade-in-down {
    animation: fade-in-down 0.6s ease-out;
  }
  
  .animate-slide-in-left {
    animation: slide-in-left 0.6s ease-out;
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.6s ease-out;
  }
  
  .animate-count-up {
    animation: count-up 0.8s ease-out;
  }
  
  .animation-delay-100 {
    animation-delay: 100ms;
  }
  
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  
  .animation-delay-300 {
    animation-delay: 300ms;
  }
  
  
  .animation-delay-500 {
    animation-delay: 500ms;
  }
</style>
