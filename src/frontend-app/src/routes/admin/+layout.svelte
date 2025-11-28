<script lang="ts">
  
  import { invalidateAll } from '$app/navigation';
  import { browser } from '$app/environment';
  import Login from "../../Components/admins/login/login.svelte"
  import axios from 'axios';
  function reloadPage() {
    invalidateAll();
  }
  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Útil para CORS com cookies/sessão
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  let token = null;
  let role=null
  function parseJwt(token:string):string {
    const base64Url = token.split(".")[1]; // pega só o payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // converte Base64URL p/ Base64 normal
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  }
  let regra:string=""
  let adminLogado:boolean|null=null;
  let loginvalido=false
  async  function validadordeToken() {
    if(adminLogado){
      const resposta= await api.get("./admin/validation")
      loginvalido= resposta.status===200
    }
  }
  if (browser) {
    token = sessionStorage.getItem("auth_token");
    if(token){
      let user = parseJwt(token);
      role = user?.role
      regra = user?.role
    }
    adminLogado=role&&role==="admin"
    console.log(regra, token,adminLogado)
    validadordeToken()
  }
  let isLoading = false;


  function logout() {
    localStorage.removeItem('adminData');
    goto('/admin');
  }
</script>
{#if loginvalido}
  <div class="min-h-screen bg-gray-50">
    <slot />
  </div>
{:else}
  {#if !token }
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"> 
        <div class="px-4 py-3 rounded-xl shadow-lg border text-sm backdrop-blur-sm bg-red-900/90 border-red-600 text-red-100">
            <p>Você não possui um token.</p>
        </div>
    </div>  
  {:else if regra!=="admin"}
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"> 
        <div class="px-4 py-3 rounded-xl shadow-lg border text-sm backdrop-blur-sm bg-red-900/90 border-red-600 text-red-100">
            <p>Você não possui permissão para entrar.</p>
        </div>
    </div>
  {:else}
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"> 
        <div class="px-4 py-3 rounded-xl shadow-lg border text-sm backdrop-blur-sm bg-red-900/90 border-red-600 text-red-100">
            <p>Token expirou, ou é inválido</p>
        </div>
    </div>
  {/if}
  <Login/>
{/if}