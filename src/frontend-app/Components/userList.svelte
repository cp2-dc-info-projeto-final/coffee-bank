<script lang="ts">

export let nomeLista = "";
export let descricao = "";
export let nome = "";
export let nascimento = "";
export let cpf = "";
export let chavepix = "";
export let users = [];
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            {nomeLista}
            <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">{descricao}</p>
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
            </tr>
        </thead>
        <tbody>
            {#each users as user}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {nome}
                    </th>
                    <td class="px-6 py-4">
                        {nascimento}
                    </td>
                    <td class="px-6 py-4">
                        {cpf}
                    </td>
                    <td class="px-6 py-4">
                        {chavepix}
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</a>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
