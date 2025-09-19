<script lang="ts">
  
    import Textform from '../../Components/textform.svelte';
    let sucesss:string=""
    let dataerros:string[] = [];
    import { onMount } from 'svelte';
    let areaVendidaValue =0;
    let precoValue =0;
    let porcentagemValue = 0;
    let user = {};
   
  
    import ts from 'typescript';
  
    function Validationdata(data:any) {
          let erros=[];
          if(!data.Preco || !data.areaVendida || !data.Nome || !data.DF || !data.Tamanho || !data.Porcentagem){
              erros.push("Preencha todos os campos obrigatórios.");
          }
          
          if(document.getElementById("checkbox-1").checked === false){
              erros.push("Você deve aceitar os termos de contrato.");
          }
          if(data.Porcentagem > 100 ){
              erros.push("As senhas devem ter 5 e 7 dígitos respectivamente.");
          }
          if(/^\d+$/.test(data.Senha5) === false || /^\d+$/.test(data.Senha7) === false){
              erros.push("As senhas devem conter apenas números.");
          }
          dataerros = erros;
      }
  
      onMount(() => {
       
          const labels = ["preco", "area", "nome", "df", "tamanho", "porcentagem"];
          const token = sessionStorage.getItem("auth_token");
          if (token) {
                  const payload = atob(token.split(".")[1]);
                  user = JSON.parse(payload);  // parse the decoded payload to a JS object
              } else {
                  console.error("No auth token found in session storage.");
              }
              
              console.log(user.CPF)
              user.firstName=user.Name.split(" ")[0]
          async function enviar() {
              // Obtém os dados do formulário
              const data = {
  
                  CPF: user.CPF,
                  areaVendida: document.getElementById("area").value,
                  Tamanho: document.getElementById("tamanho").value,
                  Porcentagem: document.getElementById("porcentagem").value,
                  DF: document.getElementById("df").value,
                  Nome: document.getElementById("nome").value,
                  Preco: document.getElementById("preco").value               
                };
              console.log(data);
              Validationdata(data);
              if(!dataerros.length){
              // Envia os dados via POST
                  const resposta= await fetch("http://localhost:3000/investment", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data)
                  });
                  const json = await resposta.json();
                  console.log(json.sucesss, json.message);
                  if(!json.success){
                      dataerros=[json.message];
                  }
                  else if(json.success){
                      sucesss=json.message
                      document.getElementById("preco").value=""
                      document.getElementById("area").value=""
                      document.getElementById("nome").value=""
                      document.getElementById("df").value=""
                      document.getElementById("tamanho").value=""
                      document.getElementById("porcentagem").value=""
                  }
  
              }
          }
  
          const form = document.getElementById("formularioInvestimentos");
          form.addEventListener("submit", function (event) {
              event.preventDefault(); // Impede o envio padrão do form
              enviar();
              window.scrollTo({ top: 0, behavior: "smooth" }); 
          });
          var porcentagemSlider = document.getElementById("porcentagem")
          porcentagemSlider.addEventListener("input", async function(){
            porcentagemValue = porcentagemSlider;
          })
      });
  </script>
  <div class="bg-gray-100 my-5 py-3 h-full mx-10 rounded-lg ">
    <form action="POST" id="formularioInvestimentos">
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
  
            <div class="text-lg m-3">
  
              <div class="text-lg  m-3">Porcentagem</div>
              <label for="labels-range-input" class="sr-only">Labels range</label>
               <input id="porcentagem" type="range" value="1" min="1" max="100" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">
                <div class=" flex content-evenly w-full">
                  <span class="text-xl text-gray-500  relative start-0  ">{porcentagemValue}%</span>
                </div>
          </div>
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
  </div>
  
  