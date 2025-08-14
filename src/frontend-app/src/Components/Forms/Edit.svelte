<script lang="ts">
  import User from '../../Class/User';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { createEventDispatcher } from 'svelte';  
  const dispatch = createEventDispatcher();
  function enviarJson(data: { CPF?: string; Nome?: string; Imagem?: string | null; sex?: boolean }) {
    const user = new User(data);
    dispatch('login', { detail: { User: user }, bubbles: true });
  }

</script>

<div id="default-modal" tabindex="-1" aria-hidden="true" class="h-full overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center w-full md:inset-0 items-center flex" >
  <section class="dark:bg-gray-900 w-full h-full" id="login">
    <div class="flex flex-col items-center h-full justify-center px-6 lg:py-0">
      <div class="w-full shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 itemns center">
        <div class="p-6 rounded-3xl bg-white space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Formulário de edição
          </h1>
          <form class="space-y-4 md:space-y-6" method="POST" id="form">
            
            <!-- Campo Nome -->
            <div>
              <label for="nome" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Novo Nome</label>
              <input type="text" name="nome" id="nome" placeholder="Sherlock Holmes"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
            </div>
            
            <!-- Campo CPF -->
            <div>
              <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Novo CPF</label>
              <input type="text" name="cpf" id="cpf" placeholder="123.456.789-10"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
            </div>

            <!-- Campo Senha 5 -->
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nova Senha 5</label>
              <input type="password" name="password" id="password" placeholder="•••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
            </div>

            
            <!-- Campo Senha 7 -->
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nova Senha 7</label>
              <input type="password" name="password" id="password" placeholder="•••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
            </div>

           <label class="inline-flex items-center mb-5 cursor-pointer w-full text-center">
                            <input type="checkbox" value="genero" class="sr-only peer bg-blue-600" on:click={()={sexo=!sexo}}>
                            <span class="text-sm font-medium text-dark dark:text-gray-300 mx-2">Sexo:</span>
                            <span class="text-sm font-medium text-dark dark:text-gray-300"><i class="fa-solid fa-mars"></i></span>
                            <div class="mx-2 relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span class="text-sm font-medium text-dark dark:text-gray-900"><i class="fa-solid fa-venus"></i></span>
                        </label>
            <!-- Botão Confirmar -->
            <button type="submit"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Clique Para Confirmar
            </button>

          </form>
        </div>
      </div>
    </div>
  </section>
</div>