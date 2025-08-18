<script lang="ts">
  interface User {
    CPF: string;
    Nome: string;
    Sex: string; // Você pode mudar para 'M' | 'F' | 'Outro' se quiser restringir
    Senha5: string;
    Senha5conf: string;
    Senha7: string;
    Senha7conf: string;
    ChavePix: string;
  }
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
    let sexo= false
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
    if(dados.Sex){
      sexo=true
      document.getElementById("sexo").checked=true
    }
  })
    
  async function enviarJson() {
    
    let data:User={
      CPF:document.getElementById("cpf").value,
      Nome:document.getElementById("nome").value,
      Sex: sexo,
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
      goto("../gerenciamento")
    }
    else{
      alert(validation.message)
    }

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
      alert(data.Nome)
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
  
  <div id="default-modal" tabindex="-1" aria-hidden="true" class="h-full mt-5 justify-center w-full md:inset-0 items-center flex" on:load={load()}>
    <section class=" w-full h-full" id="login">
      <div class="flex flex-col items-center h-full justify-center px-6 lg:py-0">
        <div class="w-full shadow md:mt-0 sm:max-w-md xl:p-0 itemns center">
          <div class="p-6 rounded-3xl bg-white space-y-4 md:space-y-6 sm:p-8">
            <div class="w-full flex justify-between">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Formulário de edição
              </h1>
              <button class="p-0 cursor-pointer" style="background-color: transparent;" on:click={()=>{goto("../gerenciamento")}}>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form class="space-y-4 md:space-y-6" method="dialog">
              
              <!-- Campo Nome -->
              <div>
                <label for="nome" class="block mb-2 text-sm font-medium text-gray-900 ">Novo Nome</label>
                <input type="text" name="nome" id="nome" placeholder="Sherlock Holmes"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500"
                  >
              </div>
              
              <!-- Campo CPF -->
              <div>
                <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 ">Novo CPF</label>
                <input type="text" name="cpf" id="cpf" placeholder="123.456.789-10"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500"
                  >
              </div>
  
              <!-- Campo Senha 5 -->
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Nova Senha 5</label>
                <input type="password" name="password" id="password5" placeholder="•••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500"
                  >
              </div>
  
              
              <!-- Campo Senha 7 -->
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Nova Senha 7</label>
                <input type="password" name="password" id="password7" placeholder="•••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500"
                  >
              </div>
  
             <label class="inline-flex items-center mb-5 cursor-pointer w-full text-center">
                              <input type="checkbox" value="genero" class="sr-only peer bg-blue-600" on:click={()=>{sexo=!sexo}} id="sexo">
                              <span class="text-sm font-medium text-dark dark:text-gray-300 mx-2">Sexo:</span>
                              <span class="text-sm font-medium text-dark dark:text-gray-300"><i class="fa-solid fa-mars"></i></span>
                              <div class="mx-2 relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                              <span class="text-sm font-medium text-dark dark:text-gray-900"><i class="fa-solid fa-venus"></i></span>
                          </label>
              <!-- Botão Confirmar -->
              <button type="submit" on:click={enviarJson()}
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Clique Para Confirmar
              </button>
  
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>