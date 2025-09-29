<script>
    export let text;
    export let imagem;
    export let tittle;
    export let link;
    
    // Determinar cores baseadas no tipo de ação
    $: colorClasses = {
        'Transferências': 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        'Investimentos': 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
        'default': 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    };
    
    $: currentColor = colorClasses[tittle] || colorClasses.default;
</script>

<a href={link} class="group block">
    <div class="relative w-full h-60 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-700/50 hover:-translate-y-1 group-hover:scale-[1.02]">
        <!-- Gradiente de fundo sutil -->
        <div class="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 opacity-50"></div>
        
        <!-- Conteúdo principal -->
        <div class="relative z-10 h-full flex flex-col justify-center items-center p-6 text-center">
            <!-- Ícone com animação -->
            <div class="mb-4 relative">
                <div class="w-16 h-16 bg-gradient-to-br {currentColor} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <i class="{imagem} text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </div>
                <!-- Efeito de brilho sutil -->
                <div class="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <!-- Título -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {tittle}
            </h3>
            
            <!-- Descrição -->
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                {text}
            </p>
            
            <!-- Seta com animação -->
            <div class="mt-4 flex items-center text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-all duration-300">
                <span class="text-sm font-medium mr-2">Acessar</span>
                <i class="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-300"></i>
            </div>
        </div>
        
        <!-- Borda animada -->
        <div class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r {currentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude;"></div>
    </div>
</a>

<style>
    /* Animação de entrada sutil */
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
    
    :global(.animate-fade-in-up) {
        animation: fadeInUp 0.6s ease-out;
    }
</style>