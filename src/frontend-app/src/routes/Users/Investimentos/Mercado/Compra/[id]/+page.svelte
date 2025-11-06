<script lang="ts">
	import axios from "axios";
	import LinkButton from "../../../../../../Components/cards/userMainlinknavigacion.svelte"
    import { onMount } from "svelte";
    import logo from "../../../../../../assets/images/coffebank_noir-removebg-preview.png";
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { get } from "svelte/store";
    import Nav from "../../../../../../Components/Navs/UserLogin.svelte"

	
	const { id } = get(page).params;
	console.log(id)
	type Investment = { id: number, Compra: number, Preco: number, AreaTotal: string, Nome: string, DonodoInvestimento: string }
	type BackendDetail = { DonodoInvestimento: string, Preco: number, Tamanho: number, Numero: number, AreaVendida: number, Porcentagem: number, Nome: string, DF: string }

	// Links principais
	const api = axios.create({
		baseURL: 'http://localhost:3000',
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
	})
	
	const links = {
		login: "/LoginUser",
		cadastro: "/Cadastro",
		termos: "/Cadastro/termos",
		userPage: "/Users"
	};
	
    let token
    let payload
    let user = {}
	let data: Investment[] = []
	let erros: string[] = []
	let loading = true
	let isLoggedIn = false

	// Modal state
	let showModal = false
	let selected: Investment | null = null
	let detail: BackendDetail | null = null
	let detailLoading = false
	let detailError: string | null = null


	function closeModal() {
		showModal = false
		selected = null
		detail = null
		detailError = null
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && showModal) {
			closeModal()
		}
	}
	
    onMount(async() => {
        token = sessionStorage.getItem("auth_token");
        if (token) {
            payload = atob(token.split(".")[1]);
            user = JSON.parse(payload);
        }

		// Atualiza flag de login
		isLoggedIn = !!token

		window.addEventListener('keydown', handleKeydown)
		
		try {
			const resultado = await api.get(`/mercado/${id}`)
			if(resultado.status == 200){
				data = resultado.data.Data[0]
				console.log(data)
			} else {
				erros.push("Problema na consulta")
			}
		} catch (error) {
			erros.push("Erro ao carregar investimentos")
		} finally {
			loading = false
		}
    })  
	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown)
	})
</script>
<sveltehead> Fundo Imobiliário</sveltehead>
<div class="absolute w-full">
	<Nav/>
</div>
<div class="text-center my-20 animate-fade-in-up text-white">
		<div class=" text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
			<h1 class="text-4xl md:text-6xl font-extrabol m-4">
				Fundo Imobiliário {data.Nome}
				</h1>
				<div class="mb-8">
					<a href="/Users/Investimentos/Mercado" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
						<i class="fa-solid fa-arrow-left"></i>   
						<span>Voltar ao Mercado</span>
					</a>
				</div>
				<div class="flex flex-row justify-between m-10">
					<div class="flex flex-col">
						<dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Dono do investimento</dt>
						<dd class="text-lg font-semibold">{data.DonodoInvestimento}</dd>
					</div>

					
					<div class="flex flex-col pb-3">
						<dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Compra</dt>
						<dd class="text-lg font-semibold">{data.Compra}</dd>
					</div>

					
					<div class="flex flex-col pb-3">
						<dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Preco</dt>
						<dd class="text-lg font-semibold">{data.Preco}</dd>
					</div>

					
					<div class="flex flex-col pb-3">
						<dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Area Total</dt>
						<dd class="text-lg font-semibold">{data.AreaTotal}</dd>
					</div>

					
					<div class="flex flex-col pb-3">
						<dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400"> Area Vendida</dt>
						<dd class="text-lg font-semibold">{data.AreaVendida}</dd>
					</div>

					<div class="flex flex-col pb-3">
						<dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400"> Distrito Federal</dt>
						<dd class="text-lg font-semibold">{data.DF}</dd>
					</div>
				</div>

				<button class="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 text-white hover:from-amber-700 hover:to-amber-900 transition" type="button" on:click={()=>{goto(`./Mercado/Compra/${selected.id}`)}}>
					<i class="fa-solid fa-cart-shopping mr-2"></i>
					Investir
				</button>
		</div>
</div>