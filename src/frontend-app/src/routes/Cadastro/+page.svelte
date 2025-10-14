<script lang="ts">
    import Textform from '../../Components/textform.svelte';
    let sucesss:string=""
    let dataerros:string[] = [];
    import Nav from "../../Components/Navs/Main.svelte"
    import ValidationCPF from "../../Functions/CPFValidation";
    // Field-level errors\
    let errors: Record<string, string> = {
        Nome: "",
        CPF: "",
        Senha5: "",
        Senha5conf: "",
        Senha7: "",
        Senha7conf: "",
        termos: "",
        file: ""
    };
    let selectedFileName: string = "";
    // Toast state
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
    function Validationdata(data:any) {
        errors = { Nome: "", CPF: "", Senha5: "", Senha5conf: "", Senha7: "", Senha7conf: "", termos: "", file: "" };

        if(!data.Nome){ errors.Nome = "Obrigatório"; }
        if(!data.CPF){ errors.CPF = "Obrigatório"; }
        if(!data.Senha5){ errors.Senha5 = "Obrigatório"; }
        if(!data.Senha5conf){ errors.Senha5conf = "Obrigatório"; }
        if(!data.Senha7){ errors.Senha7 = "Obrigatório"; }
        if(!data.Senha7conf){ errors.Senha7conf = "Obrigatório"; }

        const termosChecked = (document.getElementById("checkbox-1") as HTMLInputElement)?.checked === true;
        if(!termosChecked){ errors.termos = "Aceite os termos"; }

        if(data.CPF && ValidationCPF(data.CPF) === false){
            errors.CPF = "CPF inválido";
        }
        if(data.Senha5 && data.Senha5.length !== 5){
            errors.Senha5 = "Deve ter 5 dígitos";
        }
        if(data.Senha7 && data.Senha7.length !== 7){
            errors.Senha7 = "Deve ter 7 dígitos";
        }
        if((data.Senha5 && !/^\d+$/.test(data.Senha5))){
            errors.Senha5 = "Apenas números";
        }
        if((data.Senha7 && !/^\d+$/.test(data.Senha7))){
            errors.Senha7 = "Apenas números";
        }
        if((data.Senha5 && data.Senha5conf) && data.Senha5 !== data.Senha5conf){
            errors.Senha5conf = "Não confere";
        }
        if((data.Senha7 && data.Senha7conf) && data.Senha7 !== data.Senha7conf){
            errors.Senha7conf = "Não confere";
        }

        // keep legacy array cleared (not used in UI anymore)
        dataerros = [];
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
    
    // UI state: toggle password visibility
    let showPin5: boolean = false;
    let showPin5Conf: boolean = false;
    let showPin7: boolean = false;
    let showPin7Conf: boolean = false;
    onMount(() => {
        const cpfInput = document.getElementById('cpf') as HTMLInputElement | null;
        if (cpfInput) {
            cpfInput.addEventListener('input', function (e) {
                const target = e.target as HTMLInputElement | null;
                if (!target) return;
                let value = target.value.replace(/\D/g, '');

                if (value.length > 11) value = value.slice(0, 11);

                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

                target.value = value;
            });
        }
        const labels = ["cpf", "nome", "pin5", "pin7"];
        
        async function enviar() {
            // Obtém os dados do formulário
            const dropEl = document.getElementById("dropzone-file") as HTMLInputElement | null;
            const pin5El = document.getElementById("pin5") as HTMLInputElement | null;
            const pin7El = document.getElementById("pin7") as HTMLInputElement | null;
            const nomeEl = document.getElementById("nome") as HTMLInputElement | null;
            const cpfEl = document.getElementById("cpf") as HTMLInputElement | null;
            const pin7cEl = document.getElementById("pin7-confirm") as HTMLInputElement | null;
            const pin5cEl = document.getElementById("pin5-confirm") as HTMLInputElement | null;

            const filesArray: Blob[] = Array.from(dropEl?.files ?? []);
            const data = {
                file: await fileConvertBase64(filesArray),
                Senha5: pin5El?.value ?? "",
                Senha7: pin7El?.value ?? "",
                Nome: nomeEl?.value ?? "",
                CPF: cpfEl?.value ?? "",
                Senha5conf: pin5cEl?.value ?? "",
                Senha7conf: pin7cEl?.value ?? "",
            };
            console.log(data);
            Validationdata(data);
            if(Object.values(errors).every(v => v === "")){
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
                    // fallback to show as heading-level message
                    sucesss="";
                    errors.Nome = errors.Nome || json.message;
                    showToast(json.message ? [json.message] : ['Ocorreu um erro ao cadastrar.'], 'error');
                }
                else if(json.success){
                    sucesss=json.message
                    if (dropEl) dropEl.value = "";
                    if (pin5El) pin5El.value = "";
                    if (pin7El) pin7El.value = "";
                    if (nomeEl) nomeEl.value = "";
                    if (cpfEl) cpfEl.value = "";
                    if (pin7cEl) pin7cEl.value = "";
                    if (pin5cEl) pin5cEl.value = "";
                    selectedFileName="";
                    errors = { Nome: "", CPF: "", Senha5: "", Senha5conf: "", Senha7: "", Senha7conf: "", termos: "", file: "" };
                    showToast(json.message || 'Cadastro realizado com sucesso!', 'success');
                }

            }
            else {
                const labels: Record<string,string> = { Nome: 'Nome', CPF: 'CPF', Senha5: 'Senha 5 dígitos', Senha5conf: 'Confirmar senha 5', Senha7: 'Senha 7 dígitos', Senha7conf: 'Confirmar senha 7', termos: 'Termos de contrato', file: 'Arquivo' };
                const list = Object.entries(errors)
                    .filter(([_, msg]) => !!msg)
                    .map(([key, msg]) => `${labels[key] || key}: ${msg}`);
                showToast(list.length ? list : ['Verifique os campos em vermelho e tente novamente.'], 'error');
            }
        }

        const form = document.getElementById("meuFormulario") as HTMLFormElement | null;
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault(); // Impede o envio padrão do form
                enviar(); // Chama sua função personalizada
                window.scrollTo({ top: 0, behavior: "smooth" }); 
            });
        }

        const fileInput = document.getElementById("dropzone-file") as HTMLInputElement | null;
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                const file = fileInput.files && fileInput.files[0];
                selectedFileName = file ? file.name : "";
            });
        }
    });

    /*const submitButton = document.getElementById('submit')
    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" }); 
         // "smooth" for smooth scrolling
    };
    submitButton.addEventListener("click", backToTop);
    */
</script>

<style>
    .feature-card-animated {
        position: relative;
        overflow: hidden;
    }
    .feature-card-animated::after {
        content: "";
        position: absolute;
        top: -100%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(ellipse at top left, rgba(255,255,255,0.18), rgba(255,255,255,0) 45%);
        transform: rotate(15deg);
        transition: transform .6s ease, opacity .6s ease;
        opacity: 0;
        pointer-events: none;
    }
    .feature-card-animated:hover::after {
        transform: translateY(40%) rotate(15deg);
        opacity: 1;
    }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fadeInUp .6s ease-out both; }
</style>
<!-- Estrutura do componente principal -->
<div class="min-h-screen flex flex-col bg-gradient-to-br from-amber-950/20 via-amber-900/25 to-rose-950/15">
    <Nav />
    <div id="start" class="flex-1 flex overflow-auto">
        <div class="flex-1 flex overflow-auto flex-col">
            <div class="w-full flex-1 flex overflow-auto">
                <div class="flex shadow md:w-1/2 flex-wrap w-full h-full">
                   
                    <div class="flex items-center justify-center content-center flex-col w-full h-full">
                        {#if toastVisible}
                            <div class={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4`}> 
                                <div class={`px-4 py-3 rounded-xl shadow-lg border text-sm backdrop-blur-sm 
                                    ${toastType === 'success' ? 'bg-green-900/90 border-green-600 text-green-100' : ''}
                                    ${toastType === 'error' ? 'bg-red-900/90 border-red-600 text-red-100' : ''}
                                    ${toastType === 'info' ? 'bg-amber-900/90 border-amber-600 text-amber-100' : ''}
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

                        <div class="bg-amber-100/70 backdrop-blur rounded-2xl border border-amber-500/40 shadow-xl p-8 feature-card-animated animate-fade-in-up max-w-md w-full mx-4">
                            <div class="text-center mb-8">
                                <h2 class="text-3xl font-extrabold text-amber-900 mb-2">Criar sua conta</h2>
                                <p class="text-amber-800/80">Junte-se ao Coffebank e tenha controle total do seu dinheiro</p>
                            </div>
                            
                            <form action="POST" id="meuFormulario" class="space-y-4">
                                <div>
                                    <Textform 
                                        Content="Nome"
                                        Name="nome"
                                        id="nome"
                                        color="amber-900"
                                    />
                                    {#if errors.Nome}
                                        <p class="text-xs text-red-500 mt-1">{errors.Nome}</p>
                                    {/if}
                                </div>
                                <div>
                                    <Textform 
                                        Content="CPF"
                                        Name="cpf"
                                        id="cpf"
                                        color="amber-900"
                                    />
                                    {#if errors.CPF}
                                        <p class="text-xs text-red-500 mt-1">{errors.CPF}</p>
                                    {/if}
                                </div>
                                <div>
                                    <Textform 
                                        Content="Senha 5 dígitos"
                                        Name="pin5"
                                        id="pin5"
                                        type={showPin5 ? 'text' : 'password'}
                                        color="amber-900"
                                    />
                                    <div class="flex justify-end -mt-1 pr-1">
                                        <button 
                                            type="button" 
                                            class="text-amber-700 hover:text-amber-900 transition-all duration-200 ease-out [transform:translateZ(0)] hover:scale-110 active:scale-95 active:rotate-6"
                                            aria-label="Mostrar/ocultar senha 5" 
                                            aria-pressed={showPin5}
                                            on:click={() => showPin5 = !showPin5}
                                        >
                                            {#if showPin5}
                                                <i class="fa-solid fa-eye-slash"></i>
                                            {:else}
                                                <i class="fa-solid fa-eye"></i>
                                            {/if}
                                        </button>
                                    </div>
                                    {#if errors.Senha5}
                                        <p class="text-xs text-red-500 mt-1">{errors.Senha5}</p>
                                    {/if}
                                </div>
                                <div>
                                    <Textform 
                                        Content="Confirmar senha 5 dígitos"
                                        Name="pin5-confirm"
                                        id="pin5-confirm"
                                        type={showPin5Conf ? 'text' : 'password'}
                                        color="amber-900"
                                    />
                                    <div class="flex justify-end -mt-1 pr-1">
                                        <button 
                                            type="button" 
                                            class="text-amber-700 hover:text-amber-900 transition-all duration-200 ease-out [transform:translateZ(0)] hover:scale-110 active:scale-95 active:rotate-6"
                                            aria-label="Mostrar/ocultar confirmação senha 5" 
                                            aria-pressed={showPin5Conf}
                                            on:click={() => showPin5Conf = !showPin5Conf}
                                        >
                                            {#if showPin5Conf}
                                                <i class="fa-solid fa-eye-slash"></i>
                                            {:else}
                                                <i class="fa-solid fa-eye"></i>
                                            {/if}
                                        </button>
                                    </div>
                                    {#if errors.Senha5conf}
                                        <p class="text-xs text-red-500 mt-1">{errors.Senha5conf}</p>
                                    {/if}
                                </div>
                                <div>
                                    <Textform 
                                        Content="Senha 7 dígitos"
                                        Name="pin7"
                                        id="pin7"
                                        type={showPin7 ? 'text' : 'password'}
                                        color="amber-900"
                                    />
                                    <div class="flex justify-end -mt-1 pr-1">
                                        <button 
                                            type="button" 
                                            class="text-amber-700 hover:text-amber-900 transition-all duration-200 ease-out [transform:translateZ(0)] hover:scale-110 active:scale-95 active:rotate-6"
                                            aria-label="Mostrar/ocultar senha 7" 
                                            aria-pressed={showPin7}
                                            on:click={() => showPin7 = !showPin7}
                                        >
                                            {#if showPin7}
                                                <i class="fa-solid fa-eye-slash"></i>
                                            {:else}
                                                <i class="fa-solid fa-eye"></i>
                                            {/if}
                                        </button>
                                    </div>
                                    {#if errors.Senha7}
                                        <p class="text-xs text-red-500 mt-1">{errors.Senha7}</p>
                                    {/if}
                                </div>
                                <div>
                                    <Textform 
                                        Content="Confirmar senha 7 dígitos"
                                        Name="pin7-confirm"
                                        id="pin7-confirm"
                                        type={showPin7Conf ? 'text' : 'password'}
                                        color="amber-900"
                                    />
                                    <div class="flex justify-end -mt-1 pr-1">
                                        <button 
                                            type="button" 
                                            class="text-amber-700 hover:text-amber-900 transition-all duration-200 ease-out [transform:translateZ(0)] hover:scale-110 active:scale-95 active:rotate-6"
                                            aria-label="Mostrar/ocultar confirmação senha 7" 
                                            aria-pressed={showPin7Conf}
                                            on:click={() => showPin7Conf = !showPin7Conf}
                                        >
                                            {#if showPin7Conf}
                                                <i class="fa-solid fa-eye-slash"></i>
                                            {:else}
                                                <i class="fa-solid fa-eye"></i>
                                            {/if}
                                        </button>
                                    </div>
                                    {#if errors.Senha7conf}
                                        <p class="text-xs text-red-500 mt-1">{errors.Senha7conf}</p>
                                    {/if}
                                </div>
                                <div class="mb-4 flex items-center justify-center w-full">
                                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-amber-400/60 border-dashed rounded-xl cursor-pointer bg-amber-100/40 hover:bg-amber-100/60 transition-colors">
                                        <div class="flex flex-col items-center justify-center pt-4 pb-4">
                                            <svg class="w-6 h-6 mb-2 text-amber-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p class="mb-1 text-sm text-amber-800">
                                                {#if selectedFileName}
                                                    <span class="font-medium text-amber-800">{selectedFileName}</span>
                                                {:else}
                                                    <span class="font-medium">Clique para enviar</span> ou arraste e solte
                                                {/if}
                                            </p>
                                            <p class="text-xs text-amber-700/70">PNG, JPG ou GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="dropzone-file" type="file" class="hidden" />
                                    </label>
                                </div>
                                <label for="checkbox-1" class="block cursor-pointer select-none">
                                    <div class="flex items-start gap-3 bg-amber-100/50 border border-amber-300/60 hover:border-amber-400/60 transition-colors rounded-xl p-4">
                                        <input id="checkbox-1" name="termos" type="checkbox" value="concordo" class="peer sr-only">
                                        <div class="mt-0.5 h-5 w-5 rounded-md border border-amber-400 bg-white flex items-center justify-center peer-checked:bg-amber-700 peer-checked:border-amber-700 transition-colors">
                                            <svg class="h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm text-amber-900 font-medium">Eu aceito os <a href="./Cadastro/termos" class="text-amber-800 hover:text-amber-900 underline">termos de contrato</a></p>
                                            <p class="text-xs text-amber-700/80">Você deve aceitar para prosseguir com o cadastro.</p>
                                        </div>
                                    </div>
                                </label>
                                {#if errors.termos}
                                    <p class="text-xs text-red-500 mt-1">{errors.termos}</p>
                                {/if}
                                <div class="w-full text-center mt-4">
                                    <button type="submit" class="w-full inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white text-base font-semibold shadow-lg hover:from-amber-800 hover:to-amber-900 active:from-amber-900 active:to-amber-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M2.5 10a7.5 7.5 0 1113.493 3.578l1.312 1.313a.75.75 0 11-1.06 1.06l-1.312-1.312A7.5 7.5 0 012.5 10zm7.5-4a.75.75 0 00-.75.75V9.5H6.75a.75.75 0 000 1.5h3a.75.75 0 00.75-.75V6.75A.75.75 0 0010 6z"/>
                                        </svg>
                                        Criar minha conta
                                    </button>
                                </div> 
                            </form>
                        </div>
                    </div>        
                </div>
                <div class="hidden md:flex md:w-1/2 items-center justify-center p-8">
                    <div class="text-center">
                        <div class="mb-6">
                            <h1 class="text-4xl lg:text-5xl font-extrabold text-amber-900 mb-4">
                                Bem-vindo ao <span class="text-amber-800">Coffebank</span>
                            </h1>
                            <p class="text-lg text-amber-800/80 mb-6">
                                Sua conta digital completa, segura e sem complicações. 
                                Gerencie seu dinheiro com total transparência.
                            </p>
                        </div>

                        <!-- Benefícios -->
                        <div class="space-y-4 mb-8">
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <i class="fa-solid fa-shield-halved text-amber-700"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-amber-900">Segurança garantida</h3>
                                    <p class="text-sm text-amber-700/70">Criptografia de ponta e monitoramento 24/7</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <i class="fa-solid fa-mobile-screen text-amber-700"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-amber-900">App completo</h3>
                                    <p class="text-sm text-amber-700/70">Transferências, pagamentos e investimentos</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <i class="fa-solid fa-piggy-bank text-amber-700"></i>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-amber-900">Sem tarifas abusivas</h3>
                                    <p class="text-sm text-amber-700/70">Transparência total nos custos</p>
                                </div>
                            </div>
                        </div>

                        <!-- Imagem -->
                        <div class="relative">
                            <img
                                src={img}
                                alt="Coffebank - Banco Digital"
                                class="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg feature-card-animated"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
        
            </div>
        </div>
    </div>
</div>