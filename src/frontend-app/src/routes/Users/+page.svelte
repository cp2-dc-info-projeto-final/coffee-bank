<script>
	import { onMount } from "svelte";
    let user = {};
    let largura;
    import defaultImage from "../../assets/images/defaultUser.jpg"
	import { goto } from "$app/navigation";
    async function loading() {
        try {
            const token = sessionStorage.getItem("auth_token");
            if (token) {
                const payload = atob(token.split(".")[1]);
                user = JSON.parse(payload);  // parse the decoded payload to a JS object
            } else {
                console.error("No auth token found in session storage.");
            }
            user.firstName=user.Name.split(" ")[0]
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }
    async function logout(){
        sessionStorage.removeItem("auth_token")
        goto("../")
    }

    onMount(loading);  // Call loading() once the component is mounted
</script>
<svelte:window bind:innerWidth={largura} />
<nav class="flex flex-row w-full bg-[#3a1800b7] px-4 py-4 justify-between">
    <div class="w-max flex">
        <img src={user.Imagem ? user.Imagem : defaultImage} class="rounded-full w-[75px] h-[75px] aspect-square">
        <div class="w-max flex flex-col text-white ps-6 justify-center">
            <span class="md:text-2xl" ia-label={user.Name}>{largura<450 ?user.firstName : user.Name}</span>
            <span class="md:text-2xl">{user.CPF}</span>
        </div>
    </div>
    <div class="w-max flex flex-col justify-center md:pe-4">
        <i class="fa-solid fa-right-from-bracket text-white text-5xl hover:text-gray-300 hover:cursor-pointer" on:click={logout}></i>
    </div>
</nav>
<style>
</style>