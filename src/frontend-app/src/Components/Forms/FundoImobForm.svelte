<script lang="ts">
  
    import Textform from '../../Components/textform.svelte';
    let sucesss:string=""
    let dataerros:string[] = [];
    import { onMount } from 'svelte';
    let areaVendidaValue =0;
    let precoValue =0;
    let porcentagemValue =0;
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
          document.getElementById("porcentagem")?.addEventListener("input", async function(){
            porcentagemValue = document.getElementById("porcentagem").value;
          })
      });
  </script>
  <div class="bg-gray-100 my-5 py-3 h-full mx-10 rounded-lg">
    <form action="POST" id="formularioInvestimentos">
    <div class="relative m-6">
       
  
        <div class="flex justify-around ">
          <div class="flex flex-col my-15 gap-9 w-full mx-5 text-dark">
  
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
  
            <div class="text-lg text-white m-3">
  
              <div class="text-lg text-white m-3">Porcentagem</div>
              <label for="labels-range-input" class="sr-only">Labels range</label>
               <input id="porcentagem" type="range" value="1" min="1" max="100" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">
                <div class=" flex content-evenly w-full">
                  <span class="text-xl text-gray-500  relative start-0  ">{porcentagemValue}%</span>
                </div>
          </div>
          </div>
  
          
  
          
  
         
      </div>
      <div class="w-full text-center my-5">
        <input type="submit" value="SUBMIT" class="rounded-full p-5 bg-green-400 text-2xl px-12 hover:bg-green-500 active:bg-green-700" href="#start">
      </div>  
    </div>
    </form>
  </div>
  
  