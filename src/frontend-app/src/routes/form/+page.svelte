<script>
    import Textform from '../components/textform.svelte';

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
                <h5 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Cadastro para banco</h5>
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
                            <label for="checkbox-1" class="ms-2 text-sm text-white font-medium dark:text-gray-300">Eu aceito os <a href="./form/termos" class="text-blue-600 hover:underline dark:text-blue-500">termos de contrato.</a>.</label>
                        </div>
                        <div class="w-full text-center">
                            <input type="submit" value="SUBMIT" class="rounded-full p-5 bg-green-400 text-2xl px-12">
                        </div>
                        <ol style="list-style: disc">
                            {#each dataerros as erro}
                                <li style="color:red;;">{erro}</li>
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
<!----
    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                       Entre Por Aqui!
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu Email</label>
                            <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="">
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sua Senha</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                  <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                                </div>
                                <div class="ml-3 text-sm">
                                  <label for="remember" class="text-gray-500 dark:text-gray-300">Lembrar Minha Conta Neste Dispostivo</label>
                                </div>
                            </div>
                            <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Esqueceu Sua Senha?</a>
                        </div>
                        <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Clique Para Confirmar</button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Sem Uma Conta Ainda? <a href="#pa" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Crie Uma Aqui!</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
      </section>
    --->
    
    