<script>
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  /** @type {Array<any>} */
  let logs = [];
  let isLoading = true;
  let error = '';
  let slideIndex = 0;
  /** @type {ReturnType<typeof setInterval> | null} */
  let rotateInterval = null;
  /** @type {ReturnType<typeof setInterval> | null} */
  let refreshInterval = null;

  function getAuthToken() {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth_token');
    }
    return null;
  }

  function getAuthHeaders() {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
  }

  async function loadActivityLogs() {
    try {
      isLoading = true;
      const params = new URLSearchParams({ page: '1', limit: '20' });
      const response = await fetch(`http://localhost:3000/unified-activity/history?${params}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        logs = data.data || [];
        // Reset slide if data length changed to avoid out-of-bounds
        if (slideIndex >= Math.max(1, Math.ceil(logs.length / 2))) {
          slideIndex = 0;
        }
      } else {
        error = data.message || 'Erro ao carregar atividades';
      }
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      error = 'Erro de conexão';
    } finally {
      isLoading = false;
    }
  }

  /** @param {string | number | Date} timestamp */
  function formatActivityTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      return 'Agora mesmo';
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min atrás`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h atrás`;
    } else {
      return (
        date.toLocaleDateString('pt-BR') +
        ' ' +
        date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      );
    }
  }

  function currentSlideItems() {
    const start = slideIndex * 2;
    return logs.slice(start, start + 2);
  }

  function startRotation() {
    if (rotateInterval) clearInterval(rotateInterval);
    rotateInterval = setInterval(() => {
      const totalSlides = Math.max(1, Math.ceil(logs.length / 2));
      slideIndex = (slideIndex + 1) % totalSlides;
    }, 4000);
  }

  function startRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(async () => {
      await loadActivityLogs();
    }, 10000);
  }

  function goToFullActivity() {
    goto('/admin/admins?section=activity');
  }

  onMount(async () => {
    await loadActivityLogs();
    startRotation();
    startRefresh();
  });

  onDestroy(() => {
    if (rotateInterval) clearInterval(rotateInterval);
    if (refreshInterval) clearInterval(refreshInterval);
  });
</script>

<svelte:head>
  <title>Atividade em Tempo Real - Coffee Bank</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white flex items-center justify-center" on:click={goToFullActivity} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && goToFullActivity()} role="button" tabindex="0" aria-label="Abrir atividades completas">
  <div class="w-full max-w-3xl p-6">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold">Atividade em Tempo Real</h1>
      <p class="text-gray-300">Clique para abrir detalhes</p>
    </div>

    {#if isLoading}
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    {:else if error}
      <div class="bg-red-600/10 border border-red-600/30 text-red-200 p-4 rounded-lg text-center">
        {error}
      </div>
    {:else if logs.length === 0}
      <div class="text-center text-gray-400 py-12">Nenhuma atividade recente</div>
    {:else}
      <div class="space-y-4 transition-all duration-500">
        {#each currentSlideItems() as log}
          <div class="p-4 bg-white/5 rounded-xl border border-white/10">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-300">{formatActivityTime(log.createdAt)}</div>
              <span class="px-2 py-1 text-xs rounded bg-amber-500/20 text-amber-300">{log.action}</span>
            </div>
            <div class="mt-2 text-lg font-semibold">{log.description}</div>
            <div class="mt-1 text-sm text-gray-300">{log.userName} {#if log.ipAddress}- {log.ipAddress}{/if}</div>
          </div>
        {/each}

        <div class="flex items-center justify-center gap-2 mt-2">
          {#each Array(Math.max(1, Math.ceil(logs.length / 2))) as _, i}
            <div class="h-1.5 w-6 rounded-full {i === slideIndex ? 'bg-amber-500' : 'bg-white/20'}"></div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Keep styles minimal for display purposes */
</style>


