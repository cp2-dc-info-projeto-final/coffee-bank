<script>
    import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
    import Image404 from "../../assets/images/Error404.png";
      let logado=false
    let token = null;
    let role=null
    if (browser) {
        token = sessionStorage.getItem("auth_token");
        if(token){
          const payload = atob(token.split(".")[1]);
          let user = JSON.parse(payload);
          role = user.role
        }
        logado=role&&role==="user"
        if(!logado){
          localStorage.setItem('ForcedReturn', "true");
          goto("/")
        }
    }
    
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