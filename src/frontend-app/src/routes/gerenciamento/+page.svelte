<script lang="ts">
    import UserList from '../../Components/userList.svelte';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    let user = {};
    
    onMount(() => {
        const token = sessionStorage.getItem("auth_token");
        if (token) {
            const payload = atob(token.split(".")[1]);
            user = JSON.parse(payload);
        }
    });
</script>

<!-- Página de Gerenciamento -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Header da Página -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 animate-fade-in-up">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <i class="fa-solid fa-users-cog text-white text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                            Gerenciamento de Usuários
                        </h1>
                        <p class="text-gray-600 dark:text-gray-400">
                            Gerencie contas e permissões do sistema
                        </p>
                    </div>
                </div>
                
                <!-- Botão de Admin -->
                <a 
                    href="/admin" 
                    class="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    aria-current="page"
                >
                    <i class="fa-solid fa-money-bill-trend-up text-xl group-hover:scale-110 transition-transform duration-200"></i>
                    <span class="font-medium">Painel Admin</span>
                    <i class="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-200"></i>
                </a>
            </div>
        </div>

        <!-- Estatísticas Rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up hover:shadow-md transition-all duration-300" style="animation-delay: 0.1s;">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-users text-blue-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Usuários</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up hover:shadow-md transition-all duration-300" style="animation-delay: 0.2s;">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-user-check text-green-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Usuários Ativos</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up hover:shadow-md transition-all duration-300" style="animation-delay: 0.3s;">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-wallet text-purple-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo Total</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">R$ 0,00</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up hover:shadow-md transition-all duration-300" style="animation-delay: 0.4s;">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <i class="fa-solid fa-chart-line text-orange-600 text-xl"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Crescimento</p>
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">+12%</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lista de Usuários -->
        <div class="animate-fade-in-up" style="animation-delay: 0.5s;">
            <UserList />
        </div>
    </div>
</div>

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
    
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }
</style>
