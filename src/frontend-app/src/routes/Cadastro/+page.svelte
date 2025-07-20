<script>
    import Textform from '../../Components/textform.svelte';

// @ts-nocheck
    let dataerros = [];
    import ValidationCPF from "../../Functions/CPFValidation";
    function Validationdata(data){
        let erros=[];
        if(!data.CPF || !data.Nome || !data.Senha5 || !data.Senha5conf || !data.Senha7 || !data.Senha7conf){
            erros.push("Preencha todos os campos obrigatórios.");
        }
        if(document.getElementById("checkbox-1").checked === false){
            erros.push("Você deve aceitar os termos de contrato.");
        }
        if(data.Senha5 !== data.Senha5conf || data.Senha7 !== data.Senha7conf){
            erros.push("As senhas não conferem.");
        }
        if(ValidationCPF(data.CPF) === false){
            erros.push("CPF inválido.");
        }
        if(data.Senha5.length !== 5 || data.Senha7.length !== 7){
            erros.push("As senhas devem ter 5 e 7 dígitos respectivamente.");
        }
        if(/^\d+$/.test(data.Senha5) === false || /^\d+$/.test(data.Senha7) === false){
            erros.push("As senhas devem conter apenas números.");
        }
        dataerros = erros;
    }
    import { onMount } from 'svelte';
    let sexo=false;
    import img from "../../assets/images/image-removebg-preview (2).png"
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
                Senha5: document.getElementById("pin5").value,
                Senha7: document.getElementById("pin7").value,
                Nome: document.getElementById("nome").value,
                CPF: document.getElementById("cpf").value,
                Senha7conf:document.getElementById("pin7-confirm").value,
                Senha5conf:document.getElementById("pin5-confirm").value,
                Sex: sexo
            };
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
                console.log(json);
                if(!json.success){
                    dataerros=[json.message];
                }

            }
        }

        const form = document.getElementById("meuFormulario");
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Impede o envio padrão do form
            enviar(); // Chama sua função personalizada
        });
    });
</script>


    <div class="w-full flex" style="background: linear-gradient(to right, #240f00, #615145)">
        <div class="shadow h-screen md:w-1/2 flex flex-wrap w-full">
            <div class="flex items-center justify-center content-center flex-col w-full">
                <h2 class="text-2xl font-semibold tracking-tight text-white dark:text-white">Cadastro</h2>
                <div class="w-full justify-center content-center my-10 px-5">
                    <form action="POST" id="meuFormulario">
                        <div>
                            <Textform 
                                Content="Nome"
                                Name="nome"
                                id="nome"
                            />
                        </div>
                        <div>
                            <Textform 
                                Content="CPF"
                                Name="cpf"
                                id="cpf"
                            />
                        </div>
                        <div>
                            <Textform 
                                Content="Senha 5 dígitos"
                                Name="pin5"
                                id="pin5"
                                type="password"
                            />
                        </div>
                        <div>
                            <Textform 
                                Content="Confirmar senha 5 dígitos"
                                Name="pin5-confirm"
                                id="pin5-confirm"
                                type="password"
                            />
                        </div>
                        <div>
                            <Textform 
                                Content="Senha 7 dígitos"
                                Name="pin7"
                                id="pin7"
                                type="password"
                            />
                        </div>
                        <div>
                            <Textform 
                                Content="Confirmar senha 7 dígitos"
                                Name="pin7-confirm"
                                id="pin7-confirm"
                                type="password"
                            />
                        </div>
                        <label class="inline-flex items-center mb-5 cursor-pointer w-full text-center">
                            <input type="checkbox" value="genero" class="sr-only peer bg-blue-600" on:click={()=>{sexo=!sexo}}>
                            <span class="text-sm font-medium text-white dark:text-gray-300 mx-2">sexo:</span>
                            <span class="text-sm font-medium text-white dark:text-gray-300"><i class="fa-solid fa-mars"></i></span>
                            <div class="mx-2 relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span class="text-sm font-medium text-white dark:text-gray-300"><i class="fa-solid fa-venus"></i></span>
                        </label>
                        <div class="flex items-center mb-4">
                            <input id="checkbox-1" name="termos" type="checkbox" value="concordo" class="w-4 h-4 text-blue-600 border-gray-300 rounded-sm">
                            <label for="checkbox-1" class="ms-2 text-sm text-white font-medium dark:text-gray-300">Eu aceito os <a href="./Cadastro/termos" class="text-blue-600 hover:underline dark:text-blue-500">termos de contrato.</a>.</label>
                        </div>
                        <div class="w-full text-center">
                            <input type="submit" value="SUBMIT" class="rounded-full p-5 bg-green-400 text-2xl px-12">
                        </div>
                        <ol style="list-style: disc">
                            {#each dataerros as erro}
                                <li style="color:red;">{erro}</li>
                            {/each}
                        </ol>
                    </form>
                </div>
            </div>        
        </div>
        <img
  src={img}
  alt="Imagem"
  class="hidden md:block w-1/2 shadow"
/>

    </div>