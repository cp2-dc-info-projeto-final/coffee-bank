<script>
    import img from "../assets/images/OIP.jpg";
    import UserCards from "../Components/cardsUser.svelte";
</script>
<div class="h-screen flex flex-col md:justify-center md:gap-2.5" id="Main">
 
    <div class="flex md:gap-2.5 flex-col md:flex-row md:flex-wrap">
        <UserCards User="dudu" CPF="123" img={img}/>
        <UserCards/>
        <UserCards/>
    </div>
    
</div>

<style>
    #Main {
        background-image: url("../assets/images/OIP.jpg");
        background-size: cover;
    }
    @media (max-width: 768px) {
        #Main {
            background-image: url("../assets/images/mobalLogin.jpg");
            background-size: cover;
            background-position: center;
        }
    }
</style>