<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  const images: string[] = [
    'https://images.pexels.com/photos/434213/pexels-photo-434213.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=1280'
  ];
  let current = 0;
  let timer: any;
  const next = () => current = (current + 1) % images.length;
  const prev = () => current = (current - 1 + images.length) % images.length;
  function startAuto() { stopAuto(); timer = setInterval(next, 4500); }
  function stopAuto() { if (timer) clearInterval(timer); }
  startAuto();
  onDestroy(stopAuto);

  // Reveal-on-scroll and Back-to-top (no header/nav changes)
  let showTop = false;
  function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    const onScroll = () => { showTop = window.scrollY > 240; };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<section class="relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-amber-700/25 via-amber-600/15 to-rose-700/20 pointer-events-none"></div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
    <div class="grid md:grid-cols-2 gap-10 items-center">
      <div class="animate-fade-in-up">
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-amber-100">Termos & Condições</h1>
        <p class="mt-3 text-amber-100/80 md:text-lg">Transparência e segurança para você usar o CoffeeBank com confiança.</p>
        <a href="#conteudo" class="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 shadow hover:shadow-lg">Ler termos</a>
      </div>
      <div class="relative animate-fade-in-up" style="animation-delay:.06s;">
        <div class="group rounded-2xl border border-amber-200/40 bg-amber-50/5 backdrop-blur p-2 shadow-xl feature-card-animated">
          <div class="relative aspect-[16/10] w-full overflow-hidden rounded-xl" role="region" aria-label="Carrossel de pessoas tomando café" on:mouseenter={stopAuto} on:mouseleave={startAuto}>
            {#each images as src, i}
              <img src={src} alt="Pessoas tomando café" class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out" style={`opacity: ${i === current ? 1 : 0};`}>
            {/each}
            <button type="button" class="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 text-white grid place-items-center hover:bg-black/60" aria-label="Slide anterior" on:click={prev}>
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 text-white grid place-items-center hover:bg-black/60" aria-label="Próximo slide" on:click={next}>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {#each images as _, i}
                <button type="button" class="h-1.5 rounded-full transition-all" style={`width:${i===current? '22px':'10px'}; background:${i===current? 'rgba(251,191,36,1)':'rgba(251,191,36,.5)'};`} on:click={() => current = i} aria-label={`Ir ao slide ${i+1}`}></button>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="conteudo" class="px-4 sm:px-6 lg:px-8 py-8">
  <div class="max-w-3xl lg:max-w-4xl mx-auto">
    <div class="bg-gradient-to-br from-white/5 to-white/10 border border-amber-200/20 rounded-2xl shadow-xl shadow-black/10 backdrop-blur-sm reveal hover:shadow-amber-900/20 transition-all duration-300">
      <div class="p-6 md:p-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-100 mb-3 text-center inline-flex items-center gap-2"><i class="fa-solid fa-mug-saucer text-amber-400"></i>Nosso propósito</h2>
        <p class="text-gray-300 leading-relaxed">
          Somos um banco 100% digital, focado em oferecer uma experiência intuitiva para o usuário e em fomentar investimentos sustentáveis no setor cafeeiro por meio de veículos financeiros responsáveis. Trabalhamos para unir tecnologia, eficiência e impacto positivo.
        </p>
      </div>
    </div>

    <div class="mt-8 grid gap-6">
      <div class="bg-gradient-to-br from-white/5 to-white/10 border border-amber-200/20 rounded-2xl p-6 md:p-8 reveal hover:shadow-lg hover:shadow-black/20 transition-all duration-300">
        <h2 class="text-xl md:text-2xl font-bold text-gray-100 mb-4 text-center inline-flex items-center gap-2"><i class="fa-solid fa-sparkles text-amber-400"></i>Por que escolher o CoffeeBank?</h2>
        <ul class="space-y-3 text-gray-300">
          <li class="flex items-start gap-3"><span class="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span><span>Interface moderna, acessível e responsiva, pensada para uso diário.</span></li>
          <li class="flex items-start gap-3"><span class="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span><span>Segurança em primeiro lugar: criptografia, monitoramento e boas práticas contínuas.</span></li>
          <li class="flex items-start gap-3"><span class="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span><span>Atendimento humano e eficiente, com foco na resolução rápida.</span></li>
          <li class="flex items-start gap-3"><span class="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span><span>Transparência em taxas e políticas: você sempre sabe o que está contratando.</span></li>
          <li class="flex items-start gap-3"><span class="mt-1 h-2 w-2 rounded-full bg-emerald-400"></span><span>Compromisso com sustentabilidade e governança no ecossistema do café.</span></li>
        </ul>
      </div>

      <div class="bg-gradient-to-br from-white/5 to-white/10 border border-amber-200/20 rounded-2xl p-6 md:p-8 reveal hover:shadow-lg hover:shadow-black/20 transition-all duration-300">
        <h2 class="text-xl md:text-2xl font-bold text-gray-100 mb-4 text-center inline-flex items-center gap-2"><i class="fa-solid fa-user-shield text-amber-400"></i>Termos de contrato — Usuário</h2>
        <ol class="list-decimal list-inside space-y-3 text-gray-300">
          <li>Em caso de inadimplência, os bens dados em garantia poderão ser executados conforme a legislação aplicável e o contrato firmado.</li>
          <li>Autorizo o tratamento de dados pessoais (como CPF) para prevenção à fraude, autenticação e segurança, de acordo com a LGPD e nossa Política de Privacidade.</li>
          <li>Autorizo, quando necessário e com base legal adequada, o uso de dados de localização para aumento da confiabilidade de transações.</li>
          <li>Em caso de mora, autorizo a comunicação aos órgãos de proteção ao crédito (ex.: SERASA), respeitados os prazos e notificações legais.</li>
          <li>Em investimentos, autorizo a cobrança de taxa de administração de 2% sobre ganhos, quando prevista no regulamento do produto.</li>
          <li>Na contratação de produtos de investimento, autorizo, quando aplicável, a cobrança de até 7% de taxa conforme previsão contratual e regulatória.</li>
          <li>Em operações de crédito, concordo com a incidência de juros remuneratórios e encargos conforme taxa pactuada (ex.: 1% a.m.), além de tributos e tarifas previstas.</li>
        </ol>
      </div>

      <div class="bg-gradient-to-br from-white/5 to-white/10 border border-amber-200/20 rounded-2xl p-6 md:p-8 reveal hover:shadow-lg hover:shadow-black/20 transition-all duration-300">
        <h2 class="text-xl md:text-2xl font-bold text-gray-100 mb-4 text-center inline-flex items-center gap-2"><i class="fa-solid fa-building-columns text-amber-400"></i>Termos de contrato — Banco</h2>
        <ol class="list-decimal list-inside space-y-3 text-gray-300">
          <li>Garantimos políticas e controles para prevenir vazamento ou uso indevido de dados, em conformidade com a LGPD.</li>
          <li>Asseguramos canais de atendimento para reclamações, sugestões e solicitações do titular.</li>
          <li>Comprometemo-nos com a integridade das informações de conta e extrato, com auditoria e registro de acessos.</li>
          <li>Praticamos transparência em diretrizes, atualizações relevantes e resultados do exercício, quando aplicável.</li>
          <li>Não compartilhamos dados pessoais com terceiros para fins comerciais sem base legal e consentimento, quando exigido.</li>
        </ol>
      </div>
    </div>

    <footer class="mt-10 text-center text-sm text-gray-400">
      Ao continuar, você declara que leu e concorda com estes termos e com a nossa Política de Privacidade.
    </footer>
  </div>
</section>

<!-- Back to top floating button -->
{#if showTop}
  <button class="fixed bottom-6 right-6 h-12 w-12 rounded-full text-white bg-gradient-to-r from-amber-600 to-amber-800 shadow-lg hover:from-amber-700 hover:to-amber-900 transition-all grid place-items-center" on:click={scrollToTop} aria-label="Voltar ao topo">
    <i class="fa-solid fa-arrow-up"></i>
  </button>
{/if}

<style>
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fadeInUp .6s ease-out both; }

  .feature-card-animated { position: relative; overflow: hidden; }
  .feature-card-animated::after {
    content: ""; position: absolute; top: -100%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(ellipse at top left, rgba(255,255,255,0.18), rgba(255,255,255,0) 45%);
    transform: rotate(15deg); transition: transform .6s ease, opacity .6s ease; opacity: 0; pointer-events: none;
  }
  .feature-card-animated:hover::after { transform: translateY(40%) rotate(15deg); opacity: 1; }

  /* Reveal on scroll */
  .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s ease-out, transform .6s ease-out, box-shadow .3s ease; }
  :global(.reveal.in-view) { opacity: 1; transform: translateY(0); }
</style>