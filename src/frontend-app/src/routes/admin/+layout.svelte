<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import Image404 from "../../assets/images/Error404.png";
  import Login from "../../Components/admins/login/login.svelte"
  let token = null;
  let role=null
  function parseJwt(token) {
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

  let adminLogado=null;
  if (browser) {
      token = sessionStorage.getItem("auth_token");
      console.log(token)
      if(token){
          let user = parseJwt(token);
          role = user.role
          console.log(role)
      }
      adminLogado=role&&role==="admin"
      console.log(adminLogado)
  }
  let isLoading = true;


  function logout() {
    localStorage.removeItem('adminData');
    goto('/admin');
  }
</script>
{#if adminLogado}
  <div class="min-h-screen bg-gradient-to-br from-[#30261c] to-[#403831]">
    {#if isLoading}
      <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#30261c] to-[#403831]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-20 w-20 border-b-4 border-[#0b8185] mx-auto mb-4"></div>
          <p class="text-[#0b8185] font-medium">Carregando...</p>
        </div>
      </div>
    {:else}
      <slot />
    {/if}
  </div>
{:else}
  <Login/>
{/if}