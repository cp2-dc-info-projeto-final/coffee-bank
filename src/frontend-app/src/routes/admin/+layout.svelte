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
  
  let adminLogado:boolean|null=null;
  let loginvalido=false
  async  function validadordeToken() {
    if(adminLogado){
      const resposta= await api.get("./admin/validation")
      loginvalido= resposta.status===200
      console.log(resposta)
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
      console.log(adminLogado)
  }
  let isLoading = false;


  function logout() {
    localStorage.removeItem('adminData');
    goto('/admin');
      validadordeToken()
  }
</script>
{#if loginvalido}
  <div class="min-h-screen bg-gray-50">
    <slot />
  </div>
{:else}
  <Login/>
{/if}