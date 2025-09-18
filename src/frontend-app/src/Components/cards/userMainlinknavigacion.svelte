<script>
    export let text;
    export let imagem;
    export let tittle;
</script>
<a href="transferênvias">
    <div class="w-full items-center content-center flex flex-col justify-center md:max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 h-50 dark:border-gray-700 text-white">
            <h5 class="mb-2 text-4xl font-semibold tracking-tight"><i class={imagem}></i> {tittle}</h5>
            <p class="inline-flex font-medium items-center">
                {text}
            <i class="ms-2 fa-solid fa-arrow-right"></i>
        </p>
    </div>
</a>