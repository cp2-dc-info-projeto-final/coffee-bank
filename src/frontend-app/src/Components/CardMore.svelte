<script>
	import { Modal } from "flowbite";
    import Login from "./Forms/Login.svelte";
    var modal=false;
</script>
<button on:click={()=>{modal=!modal}}>
    <div data-modal-target="default-modal" data-modal-toggle="default-modal" class="border md:border-0 md:rounded-lg border-gray-200 w-full md:w-70 bg-white md:bg-transparent flex flex-col shadow-lg justify-center items-center">
        <div class="md:w-full bg-white md:rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-80 justify-center items-center flex flex-col">
            <div class="flex text-center justify-center items-center ">
                <i class="fa-solid fa-plus text-4xl"></i>
                <h5 class="text-4xl mb-1 ms-2">Novo Login</h5>
            </div>
        </div>
    </div>
</button>
{#if modal}
<Login/>
{/if}
<style>
</style>