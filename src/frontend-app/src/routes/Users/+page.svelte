<script>
    import LinkButton from "../../Components/cards/userMainlinknavigacion.svelte"
import { onMount } from "svelte";

    let token
    let payload
    let user={}
    import Nav from "../../Components/Navs/UserLogin.svelte"
    onMount(()=>{
        token = sessionStorage.getItem("auth_token");
        payload = atob(token.split(".")[1]);
        user = JSON.parse(payload);
    })   
</script>
<Nav/>
<div class="mt-6 flex flex-col md:flex-row gap-1 md:gap-10 overflow-auto md:px-20">
    <LinkButton text="faça uma transferência para alguém" imagem="fa-solid fa-money-bill-transfer" tittle="transferência"/>
    <LinkButton text="Veja seua carteira de investimentos" imagem="fa-solid fa-wallet" tittle="Investimentos"/>
</div>