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
  
    function Validationdata(data:any) {
          
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
              console.log(data);

              Validationdata(data);
              
              if(!dataerros.length){
              // Envia os dados via POST
              console.log(JSON.stringify(data))
                  const resposta= await api.post("/investment",data);
                  
                  const json = await resposta.data;
                  console.log(json,resposta)
                  console.log(json.Sucess, json.Message);
                  if(!resposta.Sucess){
                    console.log("legal")
                      dataerros=[json.Message];
                  }
                  else{
                    console.log("legal")
                      sucesss=json.Message
                      document.getElementById("preco").value=""
                      document.getElementById("area").value=""
                      document.getElementById("nome").value=""
                      document.getElementById("df").value=""
                      document.getElementById("tamanho").value=""
                      document.getElementById("porcentagem").value=""
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
  <div class="bg-gray-100 my-5 py-3 h-full mx-10 rounded-lg ">
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
  </div>
  
  