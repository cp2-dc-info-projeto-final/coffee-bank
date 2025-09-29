<script>
    let visível=false
    import { onMount } from "svelte";
    let user = {};
    let largura;
    import defaultImage from "../../assets/images/defaultUser.jpg"
	import { goto } from "$app/navigation";
	import axios from 'axios';
	import User from "../../Class/User";
    async function loading() {
        try {
            const token = sessionStorage.getItem("auth_token");
            if (token) {
                const payload = atob(token.split(".")[1]);
                user = JSON.parse(payload);  // parse the decoded payload to a JS object
            } else {
                console.error("No auth token found in session storage.");
            }
            user.Name = (await axios.put("http://localhost:3000/users/Name", {"CPF":user.CPF})).data.Name
            console.log(user.Name)
            user.firstName=user.Name.split(" ")[0]
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }
    async function logout(){
        sessionStorage.removeItem("auth_token")
        goto("../")
    }

    onMount(loading);  // Call loading() once the component is mounted
</script>
<svelte:window bind:innerWidth={largura} />
<nav class="w-full bg-gradient-to-r from-[#3a1800] to-[#5d2a00] shadow-lg animate-slide-down">
    <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
            <!-- Perfil do Usuário -->
            <div class="flex items-center space-x-4 animate-fade-in-left">
                <div class="relative group">
                    <img 
                        src={user.Imagem ? user.Imagem : defaultImage} 
                        class="w-16 h-16 rounded-full border-2 border-white/20 shadow-md object-cover transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                        alt="Foto do usuário"
                    >
                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div class="flex flex-col">
                    <h2 class="text-white font-semibold text-lg md:text-xl transition-all duration-300 hover:text-white/90" aria-label={user.Name}>
                        {largura < 450 ? user.firstName : user.Name}
                    </h2>
                    <div class="flex items-center space-x-2">
                        <button 
                            class="text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
                            on:click={() => {visível = !visível}}
                            aria-label={visível ? "Ocultar saldo" : "Mostrar saldo"}
                        >
                            <i class="fa-solid {visível ? 'fa-eye' : 'fa-eye-slash'} text-sm"></i>
                        </button>
                        {#if visível}
                            <span class="text-white font-medium text-md md:text-2xl animate-fade-in">
                                {user.Saldo} Coffeekg
                            </span>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Ações do Usuário -->
            <div class="flex items-center space-x-4 animate-fade-in-right">
                <!-- Notificações (opcional) -->
                <button class="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 group">
                    <i class="fa-solid fa-bell text-lg group-hover:animate-bounce"></i>
                    <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>
                
                <!-- Logout -->
                <button 
                    class="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group hover:scale-105"
                    on:click={logout}
                    aria-label="Sair da conta"
                >
                    <i class="fa-solid fa-right-from-bracket text-lg group-hover:scale-110 transition-transform duration-200"></i>
                    <span class="hidden md:block text-sm font-medium">Sair</span>
                </button>
            </div>
        </div>
    </div>
</nav>

<style>
    /* Animações sutis para o navbar */
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .animate-slide-down {
        animation: slideDown 0.6s ease-out;
    }
    
    .animate-fade-in-left {
        animation: fadeInLeft 0.8s ease-out;
    }
    
    .animate-fade-in-right {
        animation: fadeInRight 0.8s ease-out;
    }
    
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
</style>
