<script lang="ts">
  import User from '../../Class/User';
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { goto } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';  
  import { login as authLogin } from "$lib/auth";

  const dispatch = createEventDispatcher();
  export let cpf: string = '';
  function enviarJson(data: { CPF?: string; Nome?: string; Imagem?: string | null; }) {
    const user = new User(data);
    dispatch('login', { detail: { User: user }, bubbles: true });
  }
  function Fechar() {
    const cpfInput = document.getElementById('cpf') as HTMLInputElement | null;
    const senha = document.getElementById("password") as HTMLFormElement | null;
    senha?.value=""
    cpfInput?.value=""
    dispatch('Fechar', { detail: { Event:"close" }, bubbles: true });
  }
  onMount(() => {
      const cpfInput = document.getElementById('cpf') as HTMLInputElement | null;
      const form = document.getElementById("form") as HTMLFormElement | null;
      if (cpfInput && cpf) {
          cpfInput.value = cpf;
      }
      cpfInput?.addEventListener('input', function (e: any) {
          let value = e.target.value.replace(/\D/g, '');
          if (value.length > 11) value = value.slice(0, 11);

          value = value.replace(/(\d{3})(\d)/, '$1.$2');
          value = value.replace(/(\d{3})(\d)/, '$1.$2');
          value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

          });
          
      document.getElementById('cpf')?.addEventListener('input', function (e: any) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
      });
      form?.addEventListener("submit", async function (e) {
          e.preventDefault(); // Impede o envio padrão do form
          var pass = (document.getElementById("password") as HTMLInputElement)?.value;
          var CPF = (document.getElementById("cpf") as HTMLInputElement)?.value;
          try{
             const result = await authLogin({ login: CPF, password: pass });
              //const response = await axios.put("http://localhost:3000/users/Login", data);
              if(result.success){
                //enviarJson(response.data);
                console.log(result);
                goto('/Users')
              } else {
                  console.log(result)
              }
          } catch (error) {
              console.error("Erro ao fazer login:", error);
              
          }
        
      })})
</script>
<div id="default-modal" tabindex="-1" aria-hidden="true" class="h-full overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center w-full md:inset-0 items-center flex" >
  <section class="bg-gray-900/60 w-full h-full" id="login">
    <div class="flex flex-col items-center h-full justify-center px-6 lg:py-0">
      <div class="w-full  md:mt-0 sm:max-w-md xl:p-0  itemns center">
        <div class="p-6 rounded-3xl bg-gray-800 space-y-4 md:space-y-6 sm:p-8">
          <div class="flex">
            <h1 class="text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white">            
              <button id="closeModal" type="button" on:click={Fechar} class="absolute top-3 right-3 text-gray-400 hover:text-white">
                ✕
              </button>
            </h1>
            <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">

              Login para acesso
            </h1>
          </div>
           <form class="space-y-4 md:space-y-6" method="POST" id="form">
            <!-- Campo CPF -->
            <div>
              <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 text-white">Seu CPF</label>
              <input type="text" name="cpf" id="cpf" placeholder="123.456.789-10"
                class=" border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                required>
            </div>

            <!-- Campo Senha 5 -->
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-white">Sua Senha 5</label>

              <input type="password" name="password" id="password" placeholder="•••••"
                class=" border   rounded-lg focus:ring-blue-600  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                required>
            </div>

            <!-- Checkbox Lembrar de mim -->
            <div class="flex items-start space-x-2">
              <input id="remember" type="checkbox"
                class="w-4 h-4 border border-gray-300 rounded focus:ring-3 bg-gray-700 border-gray-600 focus:ring-blue-600 ring-offset-gray-800">
              <label for="remember" class="text-sm text-dark">Lembrar de mim</label>
            </div>

            <!-- Link Esqueceu a senha -->
            <div>
              <a href="/1" class="text-sm font-medium hover:underline text-blue-500 hover:text-blue-700">Esqueceu sua senha?</a>
            </div>

            <!-- Botão Confirmar -->
            <button type="submit"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
              Clique Para Confirmar
            </button>

            <!-- Link Criar Conta -->
            <p class="text-sm font-light text-white">
              Sem uma conta ainda?
              <a href="/Cadastro" class="font-medium hover:underline text-blue-500 hover:text-blue-700">Crie uma aqui!</a>

            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</div>
<style>
  #login{
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }
</style>