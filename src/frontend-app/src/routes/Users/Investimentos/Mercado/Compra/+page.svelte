<script lang="ts">
	import axios from "axios";
	import LinkButton from "../../../../../Components/cards/userMainlinknavigacion.svelte"
    import { onMount } from "svelte";
    import logo from "../../../../../assets/images/coffebank_noir-removebg-preview.png";
	import { onDestroy } from 'svelte';
	
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

	async function openDetails(investimento: Investment) {
		showModal = true
		selected = investimento
		detailLoading = true
		detailError = null
		detail = null
		try {
			// Buscar detalhes pelo nome do proprietário (DonodoInvestimento) e filtrar pelo nome do fundo
			const resp = await api.put('/investment/Namesearch', { Name: investimento.DonodoInvestimento })
			if (resp.status === 200 && resp.data?.Data?.length) {
				const match = resp.data.Data.find((it: BackendDetail) => it.Nome === investimento.Nome)
				if (match) {
					detail = match
				} else {
					detailError = 'Fundo não encontrado para este proprietário.'
				}
			} else {
				detailError = 'Detalhes não encontrados.'
			}
		} catch (e) {
			detailError = 'Erro ao buscar detalhes do fundo.'
		} finally {
			detailLoading = false
		}
	}

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
			const resultado = await api.get("/mercado")
			if(resultado.status == 200){
				data = resultado.data.Data
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
<sveltehead> Fundo Imobiliário {}</sveltehead>
<div class="text-center mb-12 animate-fade-in-up">
    <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-4">
        Fundo Imobiliário {data.}
        </h1>
</div>