<script lang="ts">
    import axios from 'axios';
    const api = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true, // Útil para CORS com cookies/sessão
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })  
    import Textform from '../../Components/textform.svelte';
    let sucesss:string=""
    let dataerros:string[] = [];
    import { onMount } from 'svelte';
    let areaVendidaValue =0;
    let precoValue =0;
    let porcentagemValue = 0;
    let user = {};
    type ToastType = 'info' | 'success' | 'error';
    let toastVisible: boolean = false;
    let toastMessages: string[] = [];
    let toastType: ToastType = 'info';
    let toastTimeout: any;
    function showToast(messages: string | string[], type: ToastType = 'info', durationMs: number = 5000) {
        toastMessages = Array.isArray(messages) ? messages : [messages];
        toastType = type;
        toastVisible = true;
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => { toastVisible = false; }, durationMs);
    }
    function parseJwt(token:string):string {
      const base64Url = token.split(".")[1]; // pega só o payload
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // converte Base64URL p/ Base64 normal
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    }
    import ts from 'typescript';
	import ValidationCPF from '../../Functions/CPFValidation';
  
    function Validationdata(data:any) {
      if(!data.CPF||!ValidationCPF(data.CPF)){
        showToast("CPF inválida",'error');
        return false
      }
      else if(!data.Area||data.Area<0){
        showToast("Area inválida",'error');
        return false
      }
      else if(!data.AreaTotal||data.AreaTotal<0){
        showToast("Area total inválida",'error');
        return false
      }
      else if(!data.porcentagem||data.porcentagem<0||data.porcentagem>100){
        showToast("porcentagem inválida",'error');
        return false
      }
      else if(!data.DF||data.DF!==2){
        showToast("Distrito não existe",'error');
        return false
      }
      else if(!data.Nome){
        showToast("Nome nulo",'error');
        return false
      }
      else if(!data.Compra||data.Compra<0){
        showToast("Preço inválido",'error');
        return false
      }
      else if(data.AreaTotal>data.Area){
        showToast("Nome nulo",'error');
        return false
      }
      return true
    }
      async function enviar() {
        console.log("legal");      
        // Obtém os dados do formulário
          const data = {
              CPF: "123.456.789-09",
              Area: Number(document.getElementById("area").value),
              AreaTotal: Number(document.getElementById("tamanho").value),
              porcentagem: Number(document.getElementById("porcentagem").value),
              DF: document.getElementById("df").value,
              Nome: document.getElementById("nome").value,
              Compra: Number(document.getElementById("preco").value)               
            };

          let Validacao=Validationdata(data);
          
          if(!Validacao){
          // Envia os dados via POST
          var resposta:any=null
          try{
            resposta= await api.post("/investment",data);      
            const json = await resposta.data;
            if(resposta.status!==200){
              console.log("erro")
              showToast(json.Message||"erro","error");
            }
            else{
                sucesss=json.Message
                document.getElementById("preco").value=""
                document.getElementById("area").value=""
                document.getElementById("nome").value=""
                document.getElementById("df").value=""
                document.getElementById("tamanho").value=""
                document.getElementById("porcentagem").value=""
                showToast(json.message || 'Cadastro realizado com sucesso!', 'success');
            }
          }
          catch(e){
            showToast(e.response.data.Message,'error');
          } 
        }    

      }
      var token=null
      onMount(() => {
          let token = sessionStorage.getItem("auth_token");
          const labels = ["preco", "area", "nome", "df", "tamanho", "porcentagem"];
          if (token) {
                  const payload = atob(token.split(".")[1]);
                  user = JSON.parse(payload); 
                   // parse the decoded payload to a JS object
              } else {
                  console.error("No auth token found in session storage.");
              }
              console.log(user.CPF)          
              enviador()
      });
      function enviador(){
        const form = document.getElementById("formularioInvestimentos");
        form.addEventListener("submit", function (event) {
            console.log("vou matar o asafe")  
              event.preventDefault(); // Impede o envio padrão do form
              enviar();
              window.scrollTo({ top: 0, behavior: "smooth" }); 
          });
      }
  </script>
<div class="bg-gray-100 my-5 py-3 h-full mx-10 rounded-lg relative">
  {#if toastVisible}
      <div class={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4`}> 
          <div class={`px-4 py-3 rounded-xl shadow-lg border text-sm backdrop-blur-sm 
              ${toastType === 'success' ? 'bg-green-900/70 border-green-600 text-green-100' : ''}
              ${toastType === 'error' ? 'bg-red-900/70 border-red-600 text-red-100' : ''}
              ${toastType === 'info' ? 'bg-gray-900/70 border-gray-600 text-gray-100' : ''}
          `}>
              {#if toastMessages.length === 1}
                  <p>{toastMessages[0]}</p>
              {:else}
                  <ul class="list-disc ps-5 space-y-1">
                      {#each toastMessages as msg}
                          <li>{msg}</li>
                      {/each}
                  </ul>
              {/if}
          </div>
      </div>
  {/if}
  <form method="POST" id="formularioInvestimentos">
    <div class="relative m-6">
        

        <div class="flex justify-around ">
          <div class="flex flex-col my-2 gap-5 w-full mx-5 text-dark">

            <Textform 
              Content="Nome"
              Name="nome"
              id="nome"
            />

            <Textform 
              Content="Tamanho"
              Name="tamanho"
              id="tamanho"
            />

            <Textform 
              Content="Distrito Federal"
              Name="df"
              id="df"
            />

            <Textform 
              Content="Área Vendida"
              Name="area"
              id="area"
            />

            <Textform 
              Content="Preço"
              Name="preco"
              id="preco"
            />
            <Textform 
              Content="Porcentagem do investimento"
              Name="porcentagem"
              id="porcentagem"
            />

            
          </div>

          

          

          
      </div>
      <div class="w-full text-center my-5">
          <button type="submit" class="inline-flex items-center gap-2 rounded-xl px-8 py-3 bg-green-500 text-white text-base font-semibold shadow-md shadow-green-900/20 hover:bg-green-600 active:bg-green-700 transition-colors border border-white/10">
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2.5 10a7.5 7.5 0 1113.493 3.578l1.312 1.313a.75.75 0 11-1.06 1.06l-1.312-1.312A7.5 7.5 0 012.5 10zm7.5-4a.75.75 0 00-.75.75V9.5H6.75a.75.75 0 000 1.5h3a.75.75 0 00.75-.75V6.75A.75.75 0 0010 6z"/></svg>
            Cadastrar
          </button>
      </div>  
    </div>
  </form>
  <div class="absolute">
    
  </div>
</div>