<script>
    import LinkButton from "../../Components/cards/userMainlinknavigacion.svelte"
    import { onMount } from "svelte";
	import axios from 'axios';
    let largura;

    let token
    let payload
    let user = {}
    import Nav from "../../Components/Navs/UserLogin.svelte"
    
    onMount(async() => {
        token = sessionStorage.getItem("auth_token");
        payload = atob(token.split(".")[1]);
        user = JSON.parse(payload);
        user.Name = (await axios.put("http://localhost:3000/users/Name", {"CPF":user.CPF})).data.Name
        user.firstName=user.Name.split(" ")[0]
        console.log(user.firstName)
    })   

</script>
<svelte:window bind:innerWidth={largura} />
<Nav/>

<!-- Perfil Bancário -->
<div>
    <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Header do Perfil -->
        <div class="rounded-xl shadow-sm p-6 mb-8 animate-fade-in-up hover:shadow-md transition-all duration-300">
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <i class="fa-solid fa-user text-white text-2xl"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                        Olá, {largura <= 510 ? user.firstName : user.Name}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400">
                        Gerencie suas finanças de forma segura
                    </p>
                </div>
            </div>
        </div>

        <!-- Cards de Ações Principais -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="animate-fade-in-up" style="animation-delay: 0.1s;">
                <LinkButton 
                    text="Faça uma transferência para alguém" 
                    imagem="fa-solid fa-money-bill-transfer" 
                    tittle="Transferências"
                />
            </div>
            <div class="animate-fade-in-up" style="animation-delay: 0.2s;">
                <LinkButton 
                    text="Veja sua carteira de investimentos" 
                    imagem="fa-solid fa-wallet" 
                    tittle="Investimentos"
                />
            </div>
        </div>

        <!-- Resumo Rápido -->
        <div class="bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up hover:shadow-md transition-all duration-300" style="animation-delay: 0.3s;">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumo da Conta
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105">
                    <i class="fa-solid fa-wallet text-blue-500 text-2xl mb-2"></i>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Saldo Disponível</p>
                    <p class="text-xl font-bold text-gray-900 dark:text-white">R$ 0,00</p>
                </div>
                <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105">
                    <i class="fa-solid fa-chart-line text-green-500 text-2xl mb-2"></i>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Investimentos</p>
                    <p class="text-xl font-bold text-gray-900 dark:text-white">R$ 0,00</p>
                </div>
                <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105">
                    <i class="fa-solid fa-credit-card text-purple-500 text-2xl mb-2"></i>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Cartões</p>
                    <p class="text-xl font-bold text-gray-900 dark:text-white">2 ativos</p>
                </div>
            </div>
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