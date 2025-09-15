<script lang="ts">
    import Textform from '../../Components/textform.svelte';
    let sucesss:string=""
    let dataerros:string[] = [];
    import Nav from "../../Components/Navs/Main.svelte"
    import ValidationCPF from "../../Functions/CPFValidation";
    function Validationdata(data:any) {
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
    function fileConvertBase64(blob: Blob[]): Promise<string> {
        if (blob.length === 0) {
            return Promise.resolve("");
        }
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob[0]);
        });
    }
    import { onMount } from 'svelte';
    import img from "../../assets/images/1290988.jpg"
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
                Senha5conf:document.getElementById("pin5-confirm").value
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

        const form = document.getElementById("meuFormulario");
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Impede o envio padrão do form
            enviar(); // Chama sua função personalizada
            window.scrollTo({ top: 0, behavior: "smooth" }); 
        });
    });

    /*const submitButton = document.getElementById('submit')
    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" }); 
         // "smooth" for smooth scrolling
    };
    submitButton.addEventListener("click", backToTop);
    */
</script>
<!-- Estrutura do componente principal -->
<div class="min-h-screen flex flex-col" style="background-color: #240f00;">
    <Nav />
    <div id="start" class="flex-1 flex overflow-auto">
        <div class="flex-1 flex overflow-auto flex-col">
            <div class="w-full flex-1 flex overflow-auto" style="background: linear-gradient(to right, #240f00, #615145) height: 100%;">
                <div class="flex shadow md:w-1/2 flex-wrap w-full h-full">
                   
                    <div class="flex items-center justify-center content-center flex-col w-full h-full">
                        <p class="text-green-500 w-full">{sucesss}</p>
                        <ol style="list-style: disc" class="text-start w-full ps-6">
                            {#each dataerros as erro}
                                <li style="color:red;">{erro}</li>
                            {/each}
                        </ol>
    
                        <h2 class="text-2xl font-semibold tracking-tight text-white">Cadastro</h2>
                        <div class="w-full justify-center content-center mt-10 px-5">
                            
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
                                <div class="mb-4 flex items-center justify-center w-full">
                                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100  my-2">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg class="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p class="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file" type="file" class="hidden" />
                                    </label>
                                </div>
                                <div class="flex items-center">
                                    <input id="checkbox-1" name="termos" type="checkbox" value="concordo" class="w-4 h-4 text-blue-600 border-gray-300 rounded-sm">
                                    <label for="checkbox-1" class="ms-2 text-sm text-white font-medium">Eu aceito os <a href="./Cadastro/termos" class="text-blue-600 hover:underline">termos de contrato.</a>.</label>
                                </div>
                                <div class="w-full text-center mt-1">
                                    <input type="submit" value="SUBMIT" class="rounded-full p-5 bg-green-400 text-2xl px-12 hover:bg-green-500 active:bg-green-700" href="#start">
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
        </div>
    </div>
</div>