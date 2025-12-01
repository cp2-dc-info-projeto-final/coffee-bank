<script lang="ts">
    import { onMount, type CustomEvent } from 'svelte';
    import User from '../../Class/User';
    let users: User[] = [];
    function adicionarCarta(event:CustomEvent<{ User: User }>) {
        console.log(user.User);
        const user:User = event.detail.User;
        users = [...users, user];
    }
    import Nav from "../../Components/Navs/Main.svelte"
    import CardMore from "../../Components/CardMore.svelte";
    import img from "../../assets/images/OIP.jpg";
    import UserCards from "../../Components/cardsUser.svelte";
    import Login from "../../Components/Forms/Login.svelte"
</script>
<div class="absolute w-full" style="z-index: 200;">
    <Nav />
</div>
<div class="flex-1 flex flex-col md:justify-center md:gap-2.5 relative" id="Main">
    <Login on:login={adicionarCarta}/>
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