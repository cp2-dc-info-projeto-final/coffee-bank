<script lang="ts">
	import axios from "axios";
import LinkButton from "../../../Components/cards/userMainlinknavigacion.svelte"
    import { onMount } from "svelte";
    import logo from "../../../assets/images/coffebank_noir-removebg-preview.png";
	// Links principais
	const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Útil para CORS com cookies/sessão
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
	const links = {
		login: "/LoginUser",
		cadastro: "/Cadastro",
		termos: "/Cadastro/termos",
        userPage:"/Users"
	};
    let token
    let payload
    let user = {}
	let data:{id:number,Compra:number,Preco:number,AreaTotal:string,1000}[]=[]
	let erros=[]
    onMount(async() => {
        token = sessionStorage.getItem("auth_token");
        payload = atob(token.split(".")[1]);
        user = JSON.parse(payload);
		const resultado=await api.get("/mercado")
		if(resultado.status==200){
			data=resultado.data.Data
			console.log(data)
		}else{
			erros.push("Problema na consulta")
		}
    })   
</script>
<div class="flex flex-1 flex-col bg-gradient-to-br from-gray-800/15">

<header class="relative w-full">
	<div class="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1733342660123-10ab1ece90cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10 z-0"></div>
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex flex-row justify-center items-center gap-1">
		    <img src={logo} alt="Coffee Bank" class="h-10 w-10 md:h-12 md:w-12" />
            <div class=" hidden sm:inline text-3xl text-white">Coffebank</div>
        </div>
		<nav class="flex items-center gap-2 md:gap-3">
            <a href={links.userPage} class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
                    <i class="fa-solid fa-right-to-bracket"></i>
                    <span class="hidden sm:inline">Ir para userPage</span>
                </a>
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

<div class="flex flex-1 flex-col-reverse md:flex-row">
<ul class="flex flex-col w-full md:w-xl grow bg-gradient-to-br from-[#000000] rounded-2xl backdrop-blur-3xl p-10 ">
   	<h2 class="text-center text-xl md:text-5xl py-6 text-white">INVESTIMENTOS A VENDA</h2>
	{#each data as investimento}
    <li class="pb-3 sm:pb-4">
      <div class="flex items-center space-x-4 rtl:space-x-reverse">
         <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white">
               {investimento.Nome}
            </p>
            <p class="text-sm text-white">
               {investimento.DonodoInvestimento}
            </p>
         </div>
         <div class="inline-flex items-center text-base font-semibold text-white">
            {investimento.Preco} KGB
         </div>
      </div>
   	</li>
{/each}
</ul>
<div class="flex flex-10">
	
</div>
</div>
</div>
