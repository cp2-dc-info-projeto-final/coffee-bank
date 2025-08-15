<script lang="ts">
import { onMount } from 'svelte';
	import api from '$lib/api';
    import { goto } from '$app/navigation'; // navegação

    
  type User = {
    id: number;
    nome: string;
    nascimento: string;
    cpf: string;
    chavepix: string;
  };
  let users: User[] = [];
  let error = '';
  let loading = true;
  let deletingId: number | null = null; // id em deleção


  async function handleDelete(id: number) {
    deletingId = id;
    error = '';
    try {
      await api.delete(`/users/${id}`);
      users = users.filter(user => user.id !== id);
    } catch (e) {
      error = 'Erro ao remover usuário.';
    } finally {
      deletingId = null;
    }
  }

    onMount(async () => {
    try {
      const res = await api.get('/users');
      users = res.data.data;
      console.log(users);
    } catch (e) {
      error = 'Erro ao carregar usuários';
    } finally {
      loading = false;
    }
  });
  function search(cpf:string){
    
  }

</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
  <div class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <div class="flex flex-col p-5 items-center text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 md:flex-row md:justify-between md:text-start">
      <span class="text-xl text-center md:text-start">Usuários</span>
      <button on:click={() => goto(`/form/${user.id}`)} class=" hover: px-4 cursor-pointer">
        
        <form class="max-w-md mx-auto">   
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white text-xml">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <i class="w-4 h-4 text-gray-500 dark:text-gray-400 fa-solid fa-magnifying-glass">
                </i>
            </div>
            <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Pesquise Seu CPF" required />
        </div>
        </form>
      </button>
      </div>
    <div class="flex">
      {#each users as user}
        <div class="flex flex-col w-full p-6 bg-white border border-gray-200  shadow-sm dark:bg-gray-800 dark:border-gray-700">
            
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Usuário: {user.Nome} </h5>
          <p class="font-normal text-gray-700 dark:text-gray-400">Data de Nascimento: {user.Nascimento}</p>
          <p class="font-normal text-gray-700 dark:text-gray-400">CPF: {user.CPF}</p>
          <p class="font-normal text-gray-700 dark:text-gray-400">Chave Pix: {user.ChavePix}</p>
          <div class="flex items-end">
            <i on:click={() => goto(`/form/${user.id}`)} class=" text-blue-600 dark:text-blue-500 hover:underline hover:blue-700 text-xl fa-solid fa-user-pen m-4 w-full" ></i>
            <i on:click={() => handleDelete(user.id)} class="font-medium text-blue-600 dark:text-blue-500 hover:underline fa-solid fa-trash m-4 "></i>
          </div>              
        </div>
      {/each}
    </div>
  </div>
</div>
