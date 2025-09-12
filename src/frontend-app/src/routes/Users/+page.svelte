<script>
	import { onMount } from "svelte";
    let user = {};

    async function loading() {
        try {
            const token = sessionStorage.getItem("auth_token");
            if (token) {
                const payload = atob(token.split(".")[1]);
                user = JSON.parse(payload);  // parse the decoded payload to a JS object
            } else {
                console.error("No auth token found in session storage.");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    onMount(loading);  // Call loading() once the component is mounted
</script>

<nav>
    <img src={user.Imagem} class="rounded-full w-[1px] h-[1px] aspect-square">
</nav>
