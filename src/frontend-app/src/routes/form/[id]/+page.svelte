<script lang="ts">
  interface User {
    CPF: string;
    Nome: string;
    Senha5: string;
    Senha5conf: string;
    Senha7: string;
    Senha7conf: string;
    ChavePix: string;
  }
    let Erros:string[]=[]
    let showConfirmation = false;
    let isSubmitting = false;
    //import User from '../../Class/User';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { createEventDispatcher } from 'svelte';
    import ValidationCPF from '../../../Functions/CPFValidation'; 
    const dispatch = createEventDispatcher();
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
	  import { goto } from '$app/navigation';
    const { id } = get(page).params;
    console.log(id)
  onMount( async ()=>{
    const cpfInput = document.getElementById('cpf');
      cpfInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 11) value = value.slice(0, 11);

      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      e.target.value = value;
    })
    let dados=(await axios.get(`http://localhost:3000/users/${id}`)).data.data
    document.getElementById("cpf").value=dados.CPF
    document.getElementById("nome").value=dados.Nome
    })
    
  function showConfirmationModal() {
    // Atualizar preview dos dados
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    
    document.getElementById("preview-nome").textContent = nome || "Não informado";
    document.getElementById("preview-cpf").textContent = cpf || "Não informado";
    
    showConfirmation = true;
  }

  function hideConfirmationModal() {
    showConfirmation = false;
  }

  async function confirmAndSubmit() {
    isSubmitting = true;
    showConfirmation = false;
    
    let data:User={
      CPF:document.getElementById("cpf").value,
      Nome:document.getElementById("nome").value,
      Senha5:document.getElementById("password5").value,
      Senha5conf:document.getElementById("password5").value,
      Senha7:document.getElementById("password7").value,
      Senha7conf:document.getElementById("password7").value,
      ChavePix:document.getElementById("cpf").value
    }
    let validation= await Validationdata(data)
    if(validation.sucess){
      const resposta= await fetch(`http://localhost:3000/users/Update/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data)
      });
      const json = await resposta.json();
      if(json.success){
        goto("../gerenciamento")
      }
      else{
        Erros=["CPF já cadastrado por outro usuário",...Erros]
      }
    }
    else{
      Erros=validation.message
    }
    isSubmitting = false;
  }
  async function Validationdata(data:User){
    let message:string[]=[]
    let sucesss=true
    if(!data.CPF){
      sucesss=false
      message.push("CPF inválido")
    }
    else if(!ValidationCPF(data.CPF)){
      message.push("CPF inválido")
      sucesss=false
    }
    if(!data.Nome){
      message.push("Nome nulo")
      sucesss=false
    }
    if(!data.Senha5|| !data.Senha5conf){
      message.push("Senha5 nula")
      sucesss=false
    }
    else if(data.Senha5!==data.Senha5conf){
      message.push("Senha5 divergente")
      sucesss=false
    }
    else if(data.Senha5.length!==5||data.Senha5conf.length!==5){
      message.push("Senha5 inválida")
      sucesss=false
    }
    if(!data.Senha7||!data.Senha7conf){
      message.push("Senha7 nula")
      sucesss=false
    }
    
    else if(data.Senha7!==data.Senha7conf){
      message.push("Senha7 divergente")
      sucesss=false
    }
    
    else if(data.Senha7.length!==7||data.Senha7conf.length!==7){
      message.push("Senha7 inválida")
      sucesss=false
    }
    if(!data.ChavePix){
      message.push("Chave PIX nula")
      sucesss=false
    }
    if(sucesss){
      message.push("Operação sucedida!")
    }
    return {
      "sucess":sucesss,
      "message":message
    }
  }

  </script>
  
  <!-- Página de Edição de Usuário -->
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Card Principal -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up">
        <!-- Header do Formulário -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-user-edit text-white text-xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-white">
                  Editar Usuário
                </h1>
                <p class="text-blue-100">
                  Atualize as informações do usuário
                </p>
              </div>
            </div>
            
            <!-- Botão Fechar -->
            <button 
              class="group p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
              on:click={() => {goto("../gerenciamento")}}
              aria-label="Fechar formulário"
            >
              <i class="fa-solid fa-xmark text-xl group-hover:rotate-90 transition-transform duration-300"></i>
            </button>
          </div>
        </div>

        <!-- Conteúdo do Formulário -->
        <div class="p-8">
          <!-- Mensagens de Erro -->
          {#if Erros.length > 0}
            <div class="mb-6 animate-fade-in">
              {#each Erros as erro}
                <div class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-700 dark:text-red-400 p-4 rounded-lg mb-2 flex items-center">
                  <i class="fa-solid fa-exclamation-triangle mr-3"></i>
                  <span class="text-sm font-medium">{erro}</span>
                </div>
              {/each}
            </div>
          {/if}

          <form class="space-y-6" method="dialog">
            <!-- Campo Nome -->
            <div class="animate-fade-in-up" style="animation-delay: 0.1s;">
              <label for="nome" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <i class="fa-solid fa-user mr-2 text-blue-500"></i>
                Nome Completo
              </label>
              <div class="relative">
                <input 
                  type="text" 
                  name="nome" 
                  id="nome" 
                  placeholder="Digite o nome completo"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500"
                >
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fa-solid fa-user text-gray-400"></i>
                </div>
              </div>
            </div>
            
            <!-- Campo CPF -->
            <div class="animate-fade-in-up" style="animation-delay: 0.2s;">
              <label for="cpf" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <i class="fa-solid fa-id-card mr-2 text-green-500"></i>
                CPF
              </label>
              <div class="relative">
                <input 
                  type="text" 
                  name="cpf" 
                  id="cpf" 
                  placeholder="000.000.000-00"
                  class="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500"
                >
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fa-solid fa-id-card text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Senhas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Campo Senha 5 -->
              <div class="animate-fade-in-up" style="animation-delay: 0.3s;">
                <label for="password5" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fa-solid fa-lock mr-2 text-purple-500"></i>
                  Senha 5 dígitos
                </label>
                <div class="relative">
                  <input 
                    type="password" 
                    name="password5" 
                    id="password5" 
                    placeholder="•••••"
                    maxlength="5"
                    class="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500"
                  >
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fa-solid fa-lock text-gray-400"></i>
                  </div>
                </div>
              </div>
              
              <!-- Campo Senha 7 -->
              <div class="animate-fade-in-up" style="animation-delay: 0.4s;">
                <label for="password7" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <i class="fa-solid fa-key mr-2 text-orange-500"></i>
                  Senha 7 dígitos
                </label>
                <div class="relative">
                  <input 
                    type="password" 
                    name="password7" 
                    id="password7" 
                    placeholder="•••••••"
                    maxlength="7"
                    class="w-full px-4 py-3 pl-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500"
                  >
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i class="fa-solid fa-key text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botões de Ação -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in-up" style="animation-delay: 0.5s;">
              <button 
                type="button"
                on:click={() => {goto("../gerenciamento")}}
                class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <i class="fa-solid fa-arrow-left"></i>
                <span>Cancelar</span>
              </button>
              
              <button 
                type="button" 
                on:click={showConfirmationModal}
                disabled={isSubmitting}
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {#if isSubmitting}
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                {:else}
                  <i class="fa-solid fa-check group-hover:scale-110 transition-transform duration-200"></i>
                  <span>Salvar Alterações</span>
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    {#if showConfirmation}
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
        on:click={hideConfirmationModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div 
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full animate-fade-in-up"
          on:click|stopPropagation
        >
          <!-- Header do Modal -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 rounded-t-2xl">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-question text-white text-lg"></i>
              </div>
              <div>
                <h3 id="modal-title" class="text-lg font-bold text-white">Confirmar Alterações</h3>
                <p class="text-blue-100 text-sm">Você tem certeza que deseja salvar?</p>
              </div>
            </div>
          </div>

          <!-- Conteúdo do Modal -->
          <div class="p-6">
            <div class="mb-6">
              <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
                <div class="flex items-start space-x-3">
                  <i class="fa-solid fa-exclamation-triangle text-amber-500 text-lg mt-0.5"></i>
                  <div>
                    <h4 class="font-semibold text-amber-800 dark:text-amber-200 mb-2">Atenção!</h4>
                    <p class="text-sm text-amber-700 dark:text-amber-300">
                      Esta ação irá alterar permanentemente as informações do usuário. 
                      Certifique-se de que todos os dados estão corretos antes de confirmar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informações que serão alteradas -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Dados que serão atualizados:</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400">Nome:</span>
                  <span class="font-medium text-gray-900 dark:text-white" id="preview-nome">-</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400">CPF:</span>
                  <span class="font-medium text-gray-900 dark:text-white" id="preview-cpf">-</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="text-gray-600 dark:text-gray-400">Senhas:</span>
                  <span class="font-medium text-gray-900 dark:text-white">Serão atualizadas</span>
                </div>
              </div>
            </div>

            <!-- Botões do Modal -->
            <div class="flex space-x-3">
              <button 
                on:click={hideConfirmationModal}
                class="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <i class="fa-solid fa-times"></i>
                <span>Cancelar</span>
              </button>
              
              <button 
                on:click={confirmAndSubmit}
                disabled={isSubmitting}
                class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {#if isSubmitting}
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                {:else}
                  <i class="fa-solid fa-check"></i>
                  <span>Confirmar</span>
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <style>
    /* Animações sutis */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
    }
    
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
  </style>