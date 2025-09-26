<script>
  import { goto } from '$app/navigation';
  import { setToken } from "$lib/auth";
  console.log("legal")
  let cpf = '';
  let senha = '';
  let isLoading = false;
  let error = '';

  async function handleLogin() {
    if (!cpf || !senha) {
      error = 'Por favor, preencha todos os campos';
      return;
    }

    isLoading = true;
    error = '';
    try {
      const response = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CPF: cpf,
          Senha12: senha
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log(data)
        const result = await setToken(data.data);
        console.log(result)
        goto('/admin');
      } else {
        error = data.message || 'Erro ao fazer login';
      }
    } catch (err) {
      console.error('Erro no login:', err);
      error = 'Erro de conexão. Tente novamente.';
    } finally {
      isLoading = false;
    }
  }

  function formatCPF(value) {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara do CPF
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  function handleCPFInput(event) {
    cpf = formatCPF(event.target.value);
  }
</script>

<svelte:head>
  <title>Login Administrativo - Coffee Bank</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-[#30261c] to-[#403831] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-[#0b8185]">
        <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
        Painel Administrativo
      </h2>
      <p class="mt-2 text-center text-sm text-[#0b8185]">
        Coffee Bank - Sistema de Gestão
      </p>
    </div>
    
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="cpf" class="sr-only">CPF</label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#0b8185] focus:border-[#0b8185] focus:z-10 sm:text-sm"
            placeholder="CPF"
            bind:value={cpf}
            on:input={handleCPFInput}
            maxlength="14"
            disabled={isLoading}
          />
        </div>
        <div>
          <label for="senha" class="sr-only">Senha de 12 dígitos</label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#0b8185] focus:border-[#0b8185] focus:z-10 sm:text-sm"
            placeholder="Senha de 12 dígitos"
            bind:value={senha}
            maxlength="12"
            disabled={isLoading}
          />
        </div>
      </div>

      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0b8185] hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b8185] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Entrando...
          {:else}
            Entrar
          {/if}
        </button>
      </div>

      <div class="text-center">
        <a href="/" class="text-sm text-[#0b8185] hover:text-[#1f5f61]">
          ← Voltar ao site principal
        </a>
      </div>
    </form>
  </div>
</div>