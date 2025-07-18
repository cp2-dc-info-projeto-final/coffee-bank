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

</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            Usuários
            <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Uma lista com todos usuários do sistema</p>
        </caption>
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Usuário
                </th>
                <th scope="col" class="px-6 py-3">
                    Nascimento
                </th>
                <th scope="col" class="px-6 py-3">
                    CPF
                </th>
                <th scope="col" class="px-6 py-3">
                    Chave Pix
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Delete</span>
                </th>
            </tr>
        </thead>
        <tbody>
            {#each users as user}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.Nome}
                    </th>
                    <td class="px-6 py-4">
                        {user.Nascimento}
                    </td>
                    <td class="px-6 py-4">
                        {user.CPF}
                    </td>
                    <td class="px-6 py-4">
                        {user.ChavePix}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div on:click={() => goto(`/users/edit/${user.id}`)} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div on:click={() => handleDelete(user.id)} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
