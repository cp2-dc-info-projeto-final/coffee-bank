<script lang="ts">
  
  import Textform from '../../Components/textform.svelte';
  let sucesss:string=""
  let dataerros:string[] = [];
  import { onMount } from 'svelte';
  import ts from 'typescript';

    onMount(() => {
        const cpfInput = document.getElementById('cpf');
        cpfInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) value = value.slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        e.target.value = value;
    });
        const labels = ["cpf", "nome", "pin5", "pin7"];
        
        async function enviar() {
            // Obtém os dados do formulário
            const data = {
                file: await fileConvertBase64(document.getElementById("dropzone-file").files),
                Senha5: document.getElementById("pin5").value,
                Senha7: document.getElementById("pin7").value,
                Nome: document.getElementById("nome").value,
                CPF: document.getElementById("cpf").value,
                Senha7conf:document.getElementById("pin7-confirm").value,
                Senha5conf:document.getElementById("pin5-confirm").value,
                Sex: sexo
            };
            console.log(data);
            Validationdata(data);
            if(!dataerros.length){
            // Envia os dados via POST
                const resposta= await fetch("http://localhost:3000/users", {
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
                    document.getElementById("dropzone-file").files=null
                    document.getElementById("pin5").value=""
                    document.getElementById("pin7").value=""
                    document.getElementById("nome").value=""
                    document.getElementById("cpf").value=""
                    document.getElementById("pin7-confirm").value=""
                    document.getElementById("pin5-confirm").value=""
                }

            }
        }

        const form = document.getElementById("formularioInvestimentos");
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Impede o envio padrão do form
            enviar(); // Chama sua função personalizada
            window.scrollTo({ top: 0, behavior: "smooth" }); 
        });
    });
</script>
<div class="bg-gray-900 my-5 py-3 h-full mx-10 rounded-lg">
  <form action="POST" id="formularioInvestimentos">
  <div class="relative m-6">
      <div class="text-white m-6"> 
        <div class="text-xl">Cadastro de Fundo Imobiliário</div>
      </div>

      <div class="flex content-stretch">
        <div class="flex flex-col my-15 gap-9">

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
        </div>

        <div class="flex flex-col gap-0 my-0">
          <div class="text-lg text-white m-3">

            <div class="text-lg text-white m-3">Preço</div>
            <label for="labels-range-input" class="sr-only">Labels range</label>
            <input id="labels-range-input" type="range" value="1000" min="100" max="1500" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">
              <div class=" flex content-evenly w-full">
                <span class="text-sm text-gray-500  relative  ">Min ($100)</span>
                <span class="text-sm text-gray-500  relative   ">$500</span>
                <span class="text-sm text-gray-500  relative">$1000</span>
                <span class="text-sm text-gray-500  relative  ">Max ($1500)</span>
              </div>
            </div>

          <div class="text-lg text-white m-3">

            <div class="text-lg text-white m-3">Porcentagem</div>
            <label for="labels-range-input" class="sr-only">Labels range</label>
            <input id="labels-range-input" type="range" value="100" min="1" max="100" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ">
              <div class=" flex content-evenly w-full">
                <span class="text-sm text-gray-500  relative start-0  ">Min (1%)</span>
                <span class="text-sm text-gray-500  relative start-1/3    ">25%</span>
                <span class="text-sm text-gray-500  relative start-2/3">50%</span>
                <span class="text-sm text-gray-500  relative end-0  ">Max (100%)</span>
              </div>
            </div>
          
          
          
          <div class="text-lg text-white m-3">

          <div class="text-lg text-white m-3">
           Área vendida </div>
          <label for="labels-range-input" class="sr-only">Labels range</label>
          <input id="labels-range-input" type="range" value="1000" min="100" max="1500" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
          <span class="text-sm text-gray-500 dark:text-gray-400 relative start-0 -bottom-6">Min (10)</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 relative start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">$500</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 relative start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6">$1000</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 relative end-0 -bottom-6">Max ($1500)</span>
        </div>
      </div>

      
    </div>
                   
  </div>
  </form>
</div>

