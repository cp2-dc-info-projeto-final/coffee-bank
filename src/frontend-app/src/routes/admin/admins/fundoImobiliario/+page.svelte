<script lang="ts">
	import { onMount } from 'svelte';
  import axios from 'axios';
    const api = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true, // Útil para CORS com cookies/sessão
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
  let editandoFundoImob = false;
  let formData ={
    CPF:"",
    Area:0,
    AreaTotal:0,
    porcentagem:0,
    DF:"",
    Nome:"",
    Compra:0
  }

  async function pegarTodosFundoImob(){
    const resposta= await api.get("/investment");
    let fundoImobiliarios = resposta.data
    return fundoImobiliarios
  }
  async function openEditModal(fundoImobID){
    editandoFundoImob = true;
  }

  async function closeEditModal(fundoImobID){
    formData = {
      CPF:"",
      Area:0,
      AreaTotal:0,
      porcentagem:0,
      DF:"",
      Nome:"",
      Compra:0
    }
    editandoFundoImob = false;
  }

  async function deleteFundoImob(id){
    const resposta = await fetch(`http://localhost:3000/investment/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        console.log('Fundo Imobiliário deletado com sucesso')
      } else {
        console.log('Erro ao excluir fundo imobiliario');
      }
  }
  async function editFundoImob(id, data){
    const resposta = api.put(`/investiment/${id}`, data)
  }

  onMount(() => {
    pegarTodosFundoImob();
  })
    
  
</script>

<div>
  Fundos Imobiliarios atualmente registrados
</div>
{#each fundoImobiliarios as FundoImob}
  <div>Dono do Fundo Imobiliário: {FundoImob.CPF}</div> 
  <div>Area usada do fundo imobiliário: {FundoImob.Area}</div> 
  {FundoImob.AreaTotal}
  {FundoImob.porcentagem}
  {FundoImob.DF}
  {FundoImob.Nome}
  {FundoImob.Compra}
  {FundoImob.Preco}
  <div on:click={deleteFundoImob(FundoImob.id)}> </div>
  <div on:click={openEditModal(FundoImob.id)}> </div>
{/each}

{#if editandoFundoImob}
  
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div class="p-8">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#0b8185]/10 mb-4">
            <svg class="h-8 w-8 text-[#0b8185]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Editar Fundo Imobiliário</h3>
          <p class="text-gray-600 mt-2">Atualize as informações do Fundo Imobiliário</p>
        </div>
        
        <form on:submit class="space-y-6">
          <div>
            <label for="edit-nome" class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <div>
            <label for="edit-cpf" class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            
            <input
              id="edit-cpf"
              type="text"
              bind:value={formData.CPF}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg bg-gray-100"
              disabled
            />
            <p class="mt-2 text-sm text-gray-500">O CPF não pode ser alterado após a criação</p>
          </div>
          <div>
            <input
              id="edit-area"
              type="text"
              bind:value={formData.Area}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#0b8185] focus:border-[#0b8185] transition-colors"
              placeholder="Digite a area"
              required
            />
          </div>
          <div>
            <label for="edit-areaTotal" class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              id="edit-areaTotal"
              type="text"
              bind:value={formData.AreaTotal}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg bg-gray-100"
              placeholder="Digite a area total"
              required
            />
          </div>

          <div>
            <label for="edit-nome" class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              id="edit-nome"
              type="text"
              bind:value={formData.Nome}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg bg-gray-100"
              placeholder="Digite o nome completo"
              required
            />
          </div>
          
          <div>
            <label for="edit-compra" class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              id="edit-compra"
              type="text"
              bind:value={formData.Compra}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg bg-gray-100"
              placeholder="Digite o valor de compra do fundo imobiliário"
              required
            />
          </div>

          <div>
            <label for="edit-preco" class="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              id="edit-preco"
              type="text"
              bind:value={formData.Preco}
              class="block w-full px-4 py-3 border border-gray-300 rounded-xl text-lg bg-gray-100"
              placeholder="Digite o valor de compra do fundo imobiliário"
              required
            />
          </div>

          <div class="flex space-x-4 pt-4">
            <button
              type="button"
              on:click={closeEditModal}
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 text-lg font-medium rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-[#0b8185] text-white text-lg font-medium rounded-xl hover:bg-[#1f5f61] focus:outline-none focus:ring-2 focus:ring-[#0b8185]/30 transition-colors duration-200"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}