<script lang="ts">
  import { onMount } from "svelte";
  import axios from "axios";
  import logo from "../../../assets/images/coffebank_noir-removebg-preview.png";

  type Transfer = {
    id: string;
    date: string;
    to: string;
    amount: number;
    type: "Pix";
    status: "Concluída" | "Pendente" | "Falhou";
    description?: string;
  };

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  let token: string | null = null;
  let user: { CPF?: string; Saldo?: number; Name?: string; role?: string } = {};
  let isLoggedIn = false;

  const links = {
    login: "/LoginUser",
    cadastro: "/Cadastro",
    termos: "/Cadastro/termos",
    userPage: "/Users"
  };

  let pixKey = ""; // CPF do destinatário
  let amount = "";
  let description = "";
  let senha7 = "";
  let isSubmitting = false;
  let submitMessage = "";
  let loading = true;
  let erros: string[] = [];

  let balance = 0;
  let todaysSpending = 0;
  let monthSpending = 0;

  let transfers: Transfer[] = [];
  let confirmOpen = false;
  let showSenha = false;

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function parseAmount(input: string): number {
    return Number(String(input).replace(",", "."));
  }

  function validate(): string | null {
    const amountNum = parseAmount(amount);
    if (!pixKey.trim()) return "Informe a chave Pix (CPF).";
    if (!amount || isNaN(amountNum) || amountNum <= 0) return "Informe um valor válido.";
    if (amountNum > balance) return "Saldo insuficiente para esta transferência.";
    return null;
  }

  function validateSenha(): string | null {
    if (!senha7 || senha7.length !== 7 || /\D/.test(senha7)) {
      return "Informe sua Senha7 com 7 dígitos numéricos.";
    }
    return null;
  }

  function openConfirm() {
    const baseError = validate();
    if (baseError) {
      submitMessage = baseError;
      return;
    }
    submitMessage = "";
    confirmOpen = true;
  }

  async function loadUserBasics() {
    try {
      token = sessionStorage.getItem("auth_token");
      if (!token) {
        erros.push("Sessão expirada. Faça login novamente.");
        return;
      }
      const payload = atob(token.split(".")[1]);
      const parsed = JSON.parse(payload);
      user = parsed;
      balance = Number(parsed.Saldo ?? 0);
      try {
        const resp = await api.put("/users/Name", { CPF: user.CPF }, { headers: { Authorization: `Bearer ${token}` } });
        if (resp.status === 200 && resp.data?.Name) {
          user.Name = resp.data.Name;
        }
      } catch {}
    } catch (e) {
      erros.push("Erro ao carregar dados do usuário.");
    }
  }

  async function loadHistory() {
    try {
      if (!token) return;
      const resp = await api.get('/transfer/history', { headers: { Authorization: `Bearer ${token}` } });
      if (resp.data?.success && Array.isArray(resp.data.data)) {
        transfers = resp.data.data.map((row: any) => ({
          id: String(row.id),
          date: row.Data,
          to: row.destinatarioNome || row.destinatarioCPF,
          amount: Number(row.valor),
          type: "Pix",
          status: "Concluída",
          description: undefined
        }));
      }
    } catch (e) {}
  }

  async function submitTransfer() {
    const error = validate();
    if (error) { submitMessage = error; return; }
    const senhaError = validateSenha();
    if (senhaError) { submitMessage = senhaError; return; }
    if (!token) {
      submitMessage = "Sessão expirada. Faça login novamente.";
      return;
    }
    isSubmitting = true;
    submitMessage = "";
    try {
      const amountNum = parseAmount(amount);
      const normalize = (s: string) => String(s || '').replace(/[^0-9]/g, '');
      const response = await api.put(
        "/trasferencia",
        { ChavePix: normalize(pixKey) || pixKey, valor: amountNum, senha7 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response)
      if (response.status === 200 || response.data?.success) {
        balance = Number((balance - amountNum).toFixed(2));
        transfers = [
          {
            id: Math.random().toString(36).slice(2),
            date: new Date().toISOString(),
            to: pixKey,
            amount: amountNum,
            type: "Pix",
            status: "Concluída",
            description: description || undefined
          },
          ...transfers
        ];
        pixKey = "";
        amount = "";
        description = "";
        senha7 = "";
        submitMessage = "Transferência enviada com sucesso.";
        confirmOpen = false;
      } else {
        submitMessage = response.data?.message || "Falha ao realizar a transferência.";
      }
    } catch (e: any) {
      const apiMsg = e?.response?.data?.message;
      submitMessage = apiMsg || "Não foi possível realizar a transferência agora.";
    } finally {
      isSubmitting = false;
    }
  }

  onMount(async () => {
    await loadUserBasics();
    await loadHistory();
    if (user.role && user.role !== 'user') {
      erros.push('Apenas usuários podem realizar transferências.');
    }
    isLoggedIn = !!token;
    loading = false;
  });
</script>

<header class="relative w-full">
  <div class="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1733342660123-10ab1ece90cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10 z-0"></div>
  <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
    <div class="flex flex-row justify-center items-center gap-1">
      <img src={logo} alt="Coffee Bank" class="h-10 w-10 md:h-12 md:w-12" />
      <div class="hidden sm:inline text-3xl text-white font-bold">Coffebank</div>
    </div>
    <nav class="flex items-center gap-2 md:gap-3">
      <a href={links.userPage} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
        <i class="fa-solid fa-home"></i>
        <span class="hidden sm:inline">Dashboard</span>
      </a>
      {#if !isLoggedIn}
        <a href={links.login} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
          <i class="fa-solid fa-right-to-bracket"></i>
          <span class="hidden sm:inline">Entrar</span>
        </a>
        <a href={links.cadastro} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
          <i class="fa-solid fa-user-plus"></i>
          <span class="hidden sm:inline">Criar conta</span>
        </a>
      {/if}
    </nav>
  </div>
</header>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
  <a href={links.userPage} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
    <i class="fa-solid fa-arrow-left"></i>
    <span>Voltar ao Perfil</span>
  </a>
  <div class="h-2"></div>
</div>

<section class="relative w-full">
  <div class="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1733342660123-10ab1ece90cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10 z-0"></div>
  <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    <div class="flex items-center justify-between">
      <div class="animate-fade-in-up">
        <h1 class="text-2xl md:text-3xl font-extrabold text-white drop-shadow-sm">Transferências</h1>
        <p class="mt-1 text-amber-100/80">Envie dinheiro com agilidade e segurança via Pix.</p>
      </div>
      <div class="hidden sm:flex items-center gap-2 animate-fade-in-up" style="animation-delay:.05s;">
        <span class="px-3 py-1 rounded-lg text-amber-900 bg-amber-100/80 border border-amber-200/70">Saldo: {formatCurrency(balance)}</span>
      </div>
    </div>

    <div class="mt-8 grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-2xl border border-amber-200/70 bg-amber-50/70 backdrop-blur p-6 shadow feature-card-animated animate-fade-in-up">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-amber-900">Nova transferência</h2>
            <i class="fa-solid fa-money-bill-transfer text-amber-700"></i>
          </div>

          <div class="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <label for="pixKey" class="text-sm text-amber-900/80">Chave Pix</label>
              <input id="pixKey" bind:value={pixKey} placeholder="CPF do destinatário" class="mt-1 w-full rounded-xl border border-amber-300/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-600 px-3 py-2" />
            </div>
            <div>
              <label for="amount" class="text-sm text-amber-900/80">Valor</label>
              <input id="amount" bind:value={amount} inputmode="decimal" placeholder="Ex.: 120,00" class="mt-1 w-full rounded-xl border border-amber-300/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-600 px-3 py-2" />
            </div>
            <div>
              <label for="description" class="text-sm text-amber-900/80">Descrição (opcional)</label>
              <input id="description" bind:value={description} placeholder="Ex.: Almoço, aluguel..." class="mt-1 w-full rounded-xl border border-amber-300/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-600 px-3 py-2" />
            </div>
          </div>

          {#if submitMessage}
            <div class="mt-3 text-sm {submitMessage.includes('sucesso') ? 'text-green-700' : 'text-rose-700'}">{submitMessage}</div>
          {/if}

          <div class="mt-5 flex items-center gap-3">
            <button class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 shadow hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0" on:click={openConfirm} disabled={isSubmitting}>
              <i class="fa-solid fa-paper-plane"></i>
              <span>Enviar Pix</span>
            </button>
            <button class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-300/70 text-amber-900/80 hover:bg-amber-100/60 transition-all" on:click={() => { pixKey = ''; amount = ''; description = ''; submitMessage=''; }}>
              <i class="fa-solid fa-rotate"></i>
              Limpar
            </button>
          </div>
        </div>

        <div class="rounded-2xl border border-amber-200/70 bg-amber-50/70 backdrop-blur p-6 shadow feature-card-animated animate-fade-in-up" style="animation-delay:.05s;">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-amber-900">Atividade recente</h2>
            <button type="button" class="text-sm underline-none text-amber-700 hover:text-amber-900">Ver tudo</button>
          </div>
          <div class="mt-4 divide-y divide-amber-200/70">
            {#if transfers.length === 0}
              <div class="py-6 text-sm text-amber-900/70">Sem movimentações para mostrar.</div>
            {:else}
              {#each transfers.slice(0,6) as t}
                <div class="py-3 flex items-center justify-between">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-100 border border-amber-200/70 flex items-center justify-center text-amber-900">
                      <i class="fa-solid {t.status === 'Concluída' ? 'fa-circle-check' : t.status === 'Pendente' ? 'fa-clock' : 'fa-circle-xmark'}"></i>
                    </div>
                    <div class="min-w-0">
                      <div class="text-amber-900 font-medium truncate">{t.to}</div>
                      <div class="text-xs text-amber-900/70 truncate">{new Date(t.date).toLocaleString('pt-BR')} • {t.type}{t.description ? ` • ${t.description}` : ''}</div>
                    </div>
                  </div>
                  <div class="text-amber-900 font-semibold">-{formatCurrency(t.amount)}</div>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-2xl border border-amber-200/70 bg-amber-50/70 backdrop-blur p-6 shadow feature-card-animated animate-fade-in-up" style="animation-delay:.08s;">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-amber-900">Resumo</h3>
            <i class="fa-solid fa-chart-line text-amber-700"></i>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div class="summary-pill">
              <div class="text-xs text-amber-900/70">Saldo</div>
              <div class="text-amber-900 font-semibold">{formatCurrency(balance)}</div>
            </div>
            <div class="summary-pill">
              <div class="text-xs text-amber-900/70">Hoje</div>
              <div class="text-amber-900 font-semibold">-{formatCurrency(todaysSpending)}</div>
            </div>
            <div class="summary-pill">
              <div class="text-xs text-amber-900/70">No mês</div>
              <div class="text-amber-900 font-semibold">-{formatCurrency(monthSpending)}</div>
            </div>
            <div class="summary-pill">
              <div class="text-xs text-amber-900/70">Transações</div>
              <div class="text-amber-900 font-semibold">{transfers.length}</div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-100 to-rose-50 p-6 shadow feature-card-animated animate-fade-in-up" style="animation-delay:.12s;">
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-shield-halved text-amber-700 mt-1"></i>
            <div>
              <div class="font-semibold text-amber-900">Dica de segurança</div>
              <p class="text-sm text-amber-900/90 mt-1">Confira o destinatário e o valor antes de confirmar. Em caso de dúvida, cancele e tente novamente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-rose-500/20 to-amber-900/30 pointer-events-none"></div>
</section>

{#if confirmOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <button type="button" class="absolute inset-0 bg-black/50" on:click={() => { if (!isSubmitting) { confirmOpen = false; submitMessage=''; } }} aria-label="Fechar modal de confirmação"></button>
    <div class="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-amber-200/70 bg-amber-50/90 backdrop-blur p-6 shadow-xl feature-card-animated animate-fade-in-up">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-amber-900">Confirmar transferência</h3>
        <button class="text-amber-700 hover:text-amber-900" on:click={() => { if (!isSubmitting) { confirmOpen = false; submitMessage=''; } }} aria-label="Fechar">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between"><span class="text-amber-900/80">Para</span><span class="text-amber-900 font-medium truncate max-w-[60%] text-right">{pixKey}</span></div>
        <div class="flex justify-between"><span class="text-amber-900/80">Valor</span><span class="text-amber-900 font-semibold">{formatCurrency(parseAmount(amount) || 0)}</span></div>
        {#if description}
          <div class="flex justify-between"><span class="text-amber-900/80">Descrição</span><span class="text-amber-900 truncate max-w-[60%] text-right">{description}</span></div>
        {/if}
      </div>
      <div class="mt-4">
        <label for="senha7confirm" class="text-sm text-amber-900/80">Senha de transação (7 dígitos)</label>
        <div class="mt-1 relative">
          <input id="senha7confirm" bind:value={senha7} type={showSenha ? 'text' : 'password'} inputmode="numeric" maxlength="7" placeholder="Digite sua Senha7" class="w-full rounded-xl border border-amber-300/70 bg-white/90 focus:outline-none focus:ring-2 focus:ring-amber-600 px-3 py-2 pr-10" />
          <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-900" on:click={() => showSenha = !showSenha} aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}>
            <i class="fa-solid {showSenha ? 'fa-eye-slash' : 'fa-eye'}"></i>
          </button>
        </div>
        {#if submitMessage && submitMessage.includes('Senha7')}
          <div class="mt-2 text-sm text-rose-700">{submitMessage}</div>
        {/if}
      </div>
      <div class="mt-5 flex items-center gap-3">
        <button class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 shadow hover:shadow-lg disabled:opacity-60" on:click={submitTransfer} disabled={isSubmitting}>
          <i class="fa-solid fa-check"></i>
          <span>{isSubmitting ? 'Enviando...' : 'Confirmar'}</span>
        </button>
        <button class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-300/70 text-amber-900/80 hover:bg-amber-100/60 transition-all" on:click={() => { if (!isSubmitting) { confirmOpen = false; submitMessage=''; senha7=''; } }}>
          <i class="fa-solid fa-xmark"></i>
          Cancelar
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .feature-card-animated { position: relative; overflow: hidden; }
  .feature-card-animated::after {
    content: "";
    position: absolute;
    top: -100%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at top left, rgba(255,255,255,0.18), rgba(255,255,255,0) 45%);
    transform: rotate(15deg);
    transition: transform .6s ease, opacity .6s ease;
    opacity: 0;
    pointer-events: none;
  }
  .feature-card-animated:hover::after { transform: translateY(40%) rotate(15deg); opacity: 1; }

  .summary-pill {
    border: 1px solid rgba(217, 119, 6, 0.35);
    border-radius: 0.75rem;
    padding: .75rem;
    background: rgba(255,247,237,0.7);
    backdrop-filter: saturate(120%) blur(2px);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp .6s ease-out both; }
</style>


