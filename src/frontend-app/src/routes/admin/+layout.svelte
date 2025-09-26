<script lang="ts">
  
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import Login from "../../Components/admins/login/login.svelte"
  import axios from 'axios';
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
  
  let adminLogado:boolean|null=null;
  let loginvalido=false
  async  function validadordeToken() {
    if(adminLogado){
      const resposta= await api.get("./")
      console.log(resposta,resposta)
      loginvalido= resposta.status===200
      if(!loginvalido){
        alert("Login inválido")
      }
    }
  }
  if (browser) {
      token = sessionStorage.getItem("auth_token");
      if(token){
        let user = parseJwt(token);
        role = user.role
      }
      adminLogado=role&&role==="admin"
      validadordeToken()
  }

  function logout() {
    localStorage.removeItem('auth_token');
    goto('/');
  }
</script>
{#if loginvalido}
  <div class="min-h-screen bg-gradient-to-br from-[#30261c] to-[#403831]">
    <slot />
  </div>
{:else}
  <Login />
{/if}