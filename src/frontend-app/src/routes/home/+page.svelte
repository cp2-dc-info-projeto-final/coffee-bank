<script lang="ts">
	import { text } from "@sveltejs/kit";
import logo from "../../assets/images/coffebank_noir-removebg-preview.png";
	// Links principais
	const links = {
		login: "/",
		cadastro: "/Cadastro",
		termos: "/Cadastro/termos"
	};
</script>

<!-- Header-->
<header class="relative w-full">
	<div class="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1733342660123-10ab1ece90cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10 z-0"></div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
		<img src={logo} alt="Coffee Bank" class="h-10 w-10 md:h-12 md:w-12" />
		<nav class="flex items-center gap-2 md:gap-3">
			<a href={links.login} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
				<i class="fa-solid fa-right-to-bracket"></i>
				<span class="hidden sm:inline">Entrar</span>
			</a>
			<a href={links.cadastro} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
				<i class="fa-solid fa-user-plus"></i>
				<span class="hidden sm:inline">Criar conta</span>
			</a>
		</nav>
	</div>
</header>

<section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-amber-600/30 via-rose-500/20 to-amber-900/30"></div>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
		<div class="grid md:grid-cols-2 gap-10 items-center">
			<div class="animate-fade-in-up">
                <h1 class="text-3xl md:text-5xl font-extrabold text-amber-950 dark:text-amber-100 leading-tight drop-shadow-sm">
					Seu banco digital simples, seguro e sem complicação
				</h1>
                <p class="mt-4 text-amber-900/90 dark:text-amber-100/90 md:text-lg">
					Organize seu dinheiro, faça transferências e invista com transparência. Uma experiência moderna com foco em você.
				</p>
				<div class="mt-6 flex flex-col sm:flex-row gap-3">
                    <a href={links.cadastro} class="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transition-all duration-300 shadow hover:shadow-lg hover:-translate-y-0.5">
						Quero abrir minha conta
					</a>
                    <a href={links.login} class="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-amber-300/70 dark:border-amber-700/70 text-amber-900 dark:text-amber-100 hover:bg-amber-50/70 dark:hover:bg-amber-900/40 transition-all duration-300">
						Já tenho conta
					</a>
				</div>
                <p class="mt-4 text-sm text-amber-800/80 dark:text-amber-200/80">
                    Ao continuar você concorda com nossos <a href={links.termos} class="underline decoration-amber-500 decoration-2 underline-offset-2 hover:text-amber-700">Termos & Condições</a>.
				</p>
			</div>
            <div class="relative animate-fade-in-up" style="animation-delay: .1s;">
                <div class="rounded-2xl border border-amber-200/70 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 backdrop-blur p-6 shadow-md feature-card-animated">
					<ul class="space-y-4">
                        <li class="flex items-start gap-3">
                            <i class="fa-solid fa-shield-halved text-amber-700 mt-1"></i>
                            <span class="text-amber-900 dark:text-amber-100">Segurança de ponta e monitoramento em tempo real.</span>
						</li>
                        <li class="flex items-start gap-3">
                            <i class="fa-solid fa-mobile-screen text-amber-600 mt-1"></i>
                            <span class="text-amber-900 dark:text-amber-100">Um app para tudo: transferências, pagamentos e investimentos.</span>
						</li>
                        <li class="flex items-start gap-3">
                            <i class="fa-solid fa-piggy-bank text-amber-500 mt-1"></i>
                            <span class="text-amber-900 dark:text-amber-100">Sem tarifas abusivas e com experiências simples e transparentes.</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="feature-card animate-fade-in-up feature-card-animated">
            <i class="fa-solid fa-wallet text-2xl text-amber-700"></i>
			<h3 class="mt-3 font-semibold text-amber-900 dark:text-amber-100">Conta digital completa</h3>
            <p class="mt-1 text-sm text-amber-900/90 dark:text-amber-100/90">Guarde, mova e use seu dinheiro do seu jeito, com total liberdade.</p>
		</div>
        <div class="feature-card animate-fade-in-up feature-card-animated" style="animation-delay: .05s;">
            <i class="fa-solid fa-money-bill-transfer text-2xl text-amber-600"></i>
			<h3 class="mt-3 font-semibold text-amber-900 dark:text-amber-100">Transferências fáceis</h3>
            <p class="mt-1 text-sm text-amber-900/90 dark:text-amber-100/90">Envie e receba via Pix com poucos toques, em segundos.</p>
		</div>
        <div class="feature-card animate-fade-in-up feature-card-animated" style="animation-delay: .1s;">
            <i class="fa-solid fa-chart-line text-2xl text-amber-700"></i>
			<h3 class="mt-3 font-semibold text-amber-900 dark:text-amber-100">Investimentos acessíveis</h3>
            <p class="mt-1 text-sm text-amber-900/90 dark:text-amber-100/90">Comece com pouco e acompanhe sua evolução com clareza.</p>
		</div>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    <div class="rounded-2xl border border-amber-200/60 dark:border-amber-800/60 p-6 md:p-10 bg-amber-50/80 dark:bg-amber-950/40 shadow-sm feature-card-animated">
		<div class="grid md:grid-cols-2 gap-8 items-center">
			<div class="animate-fade-in-up">
                <h2 class="text-2xl md:text-3xl font-bold text-amber-950 dark:text-amber-100">Segurança é prioridade</h2>
                <p class="mt-3 text-amber-900/90 dark:text-amber-100/90">Soluções desenhadas para proteger seu dinheiro e dar suporte completo quando você precisar.</p>
				<div class="mt-5 grid sm:grid-cols-2 gap-4">
					<div class="security-item">
						<i class="fa-solid fa-lock"></i>
						<span>Criptografia e autenticação forte</span>
					</div>
					<div class="security-item">
						<i class="fa-solid fa-headset"></i>
						<span>Atendimento humano e eficiente</span>
					</div>
					<div class="security-item">
						<i class="fa-solid fa-bug"></i>
						<span>Monitoramento e prevenção de fraudes</span>
					</div>
					<div class="security-item">
						<i class="fa-solid fa-file-shield"></i>
						<span>Transparência e responsabilidade</span>
					</div>
				</div>
			</div>
			<div class="animate-fade-in-up" style="animation-delay: .08s;">
                <div class="rounded-xl bg-gradient-to-br from-amber-100 to-rose-50 dark:from-amber-950 dark:to-amber-900 border border-amber-200/70 dark:border-amber-800/60 p-6 feature-card-animated">
                    <p class="text-sm text-amber-900/90 dark:text-amber-100/90">Antes de usar nossos serviços, recomendamos a leitura dos termos para conhecer suas garantias, deveres e direitos.</p>
                    <a href={links.termos} class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 transition-all duration-300 shadow hover:shadow-lg">
						<i class="fa-solid fa-arrow-up-right-from-square"></i>
						<span>Ver Termos & Condições</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Rodapé -->
<footer class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12">
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div class="text-sm text-gray-500 dark:text-gray-400">
			© {new Date().getFullYear()} Coffee Bank. Todos os direitos reservados.
		</div>
		<nav class="flex flex-wrap items-center gap-4 text-sm">
			<a href={links.login} class="link">Login</a>
			<a href={links.cadastro} class="link">Cadastro</a>
			<a href={links.termos} class="link">Termos</a>
		</nav>
	</div>
</footer>

<style>
	.feature-card {
		border: 1px solid var(--tw-prose-borders, rgba(0,0,0,0.08));
		border-radius: 0.75rem;
		padding: 1rem;
    background: var(--tw-feature-bg, rgba(255,247,237,0.7));
		backdrop-filter: saturate(120%) blur(2px);
		transition: transform .3s ease, box-shadow .3s ease;
	}
	.feature-card:hover {
		transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(245,158,11,0.18);
	}

	.security-item {
		display: inline-flex;
		align-items: center;
		gap: .5rem;
		padding: .5rem .75rem;
		border-radius: .75rem;
    background: rgba(245, 158, 11, 0.08);
    color: #1f2937;
		font-size: .9rem;
	}
    .security-item i { color: #d97706; }

    /* Subtle shimmer/hover animation */
    .feature-card-animated {
        position: relative;
        overflow: hidden;
    }
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
    .feature-card-animated:hover::after {
        transform: translateY(40%) rotate(15deg);
        opacity: 1;
    }

	.link {
		color: #4b5563;
		text-decoration: none;
		transition: color .2s ease;
	}
	.link:hover { color: #111827; }

	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in-up { animation: fadeInUp .6s ease-out both; }
</style>

