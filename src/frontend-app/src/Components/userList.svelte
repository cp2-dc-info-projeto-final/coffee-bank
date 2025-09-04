<script lang="ts">
  import defaultImage from "../assets/images/defaultUser.jpg";
  import { onMount } from 'svelte';
	import api from '$lib/api';
  import { goto } from '$app/navigation'; // navegação
	import axios from 'axios';
	import User from "../Class/User";

  type User = {
    id: number;
    Nome: string;
    CPF: string;
    ChavePix: string;
    Image:string;
  };
  let editando={}
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
  let CPFFilter=""
  async function search(cpf:string){
    if(cpf){
      try{
        loading=true
        let req=await axios.put("http://localhost:3000/users/search",{"CPF":cpf})
        users=req.data.data
        loading=false
      }catch(e){
        users=[]
      }
    }
    else{
      try {
        const res = await api.get('/users');
        users = res.data.data;
      } catch (e) {
        error = 'Erro ao carregar usuários';  
    }
  }
  }
  function CPFTransformer(event: Event) {
    CPFFilter = event.target.value
      .replace(/\D/g, "") // remove não números
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      search(CPFFilter)
  }
</script>
<div class="relative overflow-x-auto shadow-md sm:rounded-lg ">
  <div class="w-full text-sm md:my-5 text-left rtl:text-right text-gray-500 dark:text-gray-400" >
    
    <div class="flex flex-col p-5 items-center text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800 md:flex-row md:justify-between md:text-start rounded-t-lg">
  <div class="w-full text-sm md:my-5 text-left rtl:text-right text-gray-400 " >
    <div class="flex flex-col p-5 items-center text-lg font-semibold text-left rtl:text-right text-white bg-gray-800 md:flex-row md:justify-between md:text-start rounded-t-lg">
      <span class="text-xl text-center md:text-start">Usuários</span>
      <button on:click={() => goto(`/${user.id}`)} class=" hover: px-4 cursor-pointer">
        
        <label for="default-search" class="mb-2 text-sm font-medium text-white sr-only  text-xml">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <i class="w-4 h-4 text-gray-400  fa-solid fa-magnifying-glass">
                </i>
            </div>
         <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Pesquise Seu CPF" bind:value={CPFFilter} on:input={CPFTransformer}/>
        </div>
      </button>
      </div>
    <div class="grid grid-cols-1 md:grid-cols-2 rounded-sm">
    {#each users as user, i}
    {#if editando[user.id]}
      <p>A condição é verdadeira!</p>
    {:else}
      <div
        class="w-full flex flex-col p-6 bg-gray-800 border border-gray-700 shadow-sm  rounded-b-sm
              {i === users.length - 1 && users.length % 2 !== 0 ? 'md:col-span-2' : ''}"
              id={String(user.id)}>
        <div class="flex flex-row text-center justify-center md:justify-start md:text-start">
          <img src={ user.Image ? user.Image: defaultImage } alt="" class="hidden md:me-4 md:rounded-full md:block md:w-27 md:h-27 md:aspect-square md:object-cover">
          <div>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">
          {user.Nome}
        </h5>
        <p class="font-normal text-gray-400">CPF: {user.CPF}</p>
        
        <p class="font-normal text-gray-400">Chave Pix: {user.ChavePix}</p>
        <div class="flex items-end">
          <i on:click={() => goto(`/form/${user.id}`)} class="text-blue-500 hover:text-blue-900 text-xl fa-solid fa-user-pen m-4 w-full"></i>
          <i on:click={() => handleDelete(user.id)} class="font-medium text-blue-500 hover:text-blue-900 fa-solid fa-trash m-4"></i>
        </div>
          </div>
        </div>
      </div>
    {/if}
    {/each }
    </div>
    </div>
    </div>
    </div>
    </div>