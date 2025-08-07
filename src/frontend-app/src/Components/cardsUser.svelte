<script lang="ts">
    import User from "../Class/User";
    import defaultimg from "../assets/images/defaultUser.jpg";
    export let user:User;
    let CPF= user.GetCPF();
    let Name=user.GetNome();
    let img = user.GetImagem() || defaultimg;
</script>
<div
  class="md:border-0 md:rounded-lg border-gray-200 w-full md:w-70 bg-white/50 backdrop-blur-md flex flex-col shadow-md"
>

    <div class=" md:rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
    id="main"
    >
        <img class="mb-auto rounded-t-lg w-70 h-70 aspect-square object-cover hidden md:block" src={img} alt="" />
        <div class="p-5 bg-white">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{Name}</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{CPF}</p>
            <div class="flex">
                <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Login
                <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
                </a>
                <div class="flex items-center justify-end w-full h-10 ms-4 me-2 rtl:ms-0 rtl:me-4">
                    <i class="fa-solid fa-trash"></i>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    
</style>