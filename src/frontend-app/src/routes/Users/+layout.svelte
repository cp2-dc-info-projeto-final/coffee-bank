<script>
    import { browser } from '$app/environment';
    import Image404 from "../../assets/images/Error404.png";

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
    let logado=role&&role==="user"
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
{:else}
  <div class="min-h-screen flex flex-1 flex-col items-center justify-center" style="background-color: #240f00;">
    <img src={Image404} alt="Erro 404 - Página não encontrada" class="max-w-md" />
  </div>
{/if}
