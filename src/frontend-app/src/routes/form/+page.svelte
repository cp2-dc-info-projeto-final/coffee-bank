<script>
    import Textform from '../components/textform.svelte';

import { onMount } from 'svelte';
    let sexo=false;
    import img from "../../assets/images/image-removebg-preview (2).png"
    onMount(() => {
        
        const labels = ["cpf", "nome", "pin5", "pin7"];
        
        async function enviar() {
            // Obtém os dados do formulário
            const data = {
                Senha5: document.getElementById("pin5").value,
                Senha7: document.getElementById("pin7").value,
                Nome: document.getElementById("nome").value,
                CPF: document.getElementById("cpf").value,
                Senha7conf:document.getElementById("pin7-confirm").value,
                Senha5conf:document.getElementById("pin5-confirm").value
            };

            // Envia os dados via POST
           const resposta= await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            const json = await resposta.json();

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
                <h5 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Cadastro para banco</h5>
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
                            <input type="checkbox" value="genero" class="sr-only peer" on:click={()=>{sexo=!sexo}}>
                            <span class="text-sm font-medium text-gray-900 dark:text-gray-300 mx-2">sexo:</span>
                            <span class="text-sm font-medium text-gray-900 dark:text-gray-300"><i class="fa-solid fa-mars"></i></span>
                            <div class="mx-2 relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span class="text-sm font-medium text-gray-900 dark:text-gray-300"><i class="fa-solid fa-venus"></i></span>
                        </label>
                        <div class="flex items-center mb-4">
                            <input checked id="checkbox-1" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" >
                            <label for="checkbox-1" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Eu aceito os <a href="./form/termos" class="text-blue-600 hover:underline dark:text-blue-500">termos de contrato.</a>.</label>
                        </div>
                        <div class="w-full text-center">
                            <input type="submit" value="SUBMIT" class="rounded-full p-5 bg-green-400 text-2xl px-12">
                        </div>
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
    