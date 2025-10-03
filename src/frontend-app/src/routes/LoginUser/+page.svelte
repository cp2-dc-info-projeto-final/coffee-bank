<script lang="ts">
    import type { CustomEvent } from 'svelte';
    import User from '../../Class/User';
    let users: User[] = [];
    function adicionarCarta(event:CustomEvent<{ User: User }>) {
        console.log(user.User);
        const user:User = event.detail.User;
        users = [...users, user];
    }
    import Nav from "../../Components/Navs/Main.svelte"
    import Login from "../../Components/Forms/Login.svelte";
    import CardMore from "../../Components/CardMore.svelte";
    import img from "../../assets/images/OIP.jpg";
    import UserCards from "../../Components/cardsUser.svelte";
</script>
<Nav/>

<div class="flex-1 flex flex-col md:justify-center md:gap-2.5" id="Main">
    <div class="flex md:gap-2.5 flex-col md:flex-row md:flex-wrap items-center h-full">
        {#each users as user}
            <UserCards user={user} />
        {/each}
        <CardMore on:Login={adicionarCarta}/>
    </div>
    
</div>

<style>
    #Main {
        background-image: url("../../assets/images/fundo.jpg");
        background-size: cover;
    }
    @media (max-width: 768px) {
        #Main {
            background-size: cover;
            background-position: center;
        }
    }
</style>