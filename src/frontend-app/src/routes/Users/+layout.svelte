<script>
    import { browser } from '$app/environment';
	import { onMount } from 'svelte';
    import Image404 from "../../assets/images/Error404.png";
    import axios from 'axios';
	import User from "../../Class/User";
	import { goto } from '$app/navigation';
    let token = null;
    let role=null
    if (browser) {
        token = sessionStorage.getItem("auth_token");
        if(token){
          const payload = atob(token.split(".")[1]);
          let user = JSON.parse(payload);
          role = user.role
        }
    }
    const api = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Barre: ${token}`
      },
    });
    function leave(){
      goto("/")
    }
    let status=null
    let logado=false
    onMount(async ()=>{
      try{
        status = (await api.get("/Users/tokenTeste")).status
        logado=role&&role==="user"&&status==200
      }catch(e){
        leave()
      }
      
    })
</script>

{#if logado}
  <div class="min-h-screen">
    <div
      class="min-h-screen flex flex-1 flex-col"
      style="background-color: #240f00;"
    >
      <slot />
    </div>
  </div>
{/if}
