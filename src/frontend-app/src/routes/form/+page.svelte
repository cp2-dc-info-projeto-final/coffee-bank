<script>
    import { onMount } from 'svelte';

    onMount(() => {
        const labels = ["cpf", "nome", "pin5", "pin7"];
        
        async function enviar() {
            // Obtém os dados do formulário
            const data = {
                pin5: document.getElementById("pin5").value,
                pin7: document.getElementById("pin7").value,
                nome: document.getElementById("nome").value,
                cpf: document.getElementById("cpf").value,
                Senha7conf:document.getElementById("pin7-confirm").value,
                Senha5conf:document.getElementById("pin5-confirm").value
            };

            // Envia os dados via POST
            fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
        }

        const form = document.getElementById("meuFormulario");
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Impede o envio padrão do form
            enviar(); // Chama sua função personalizada
        });
    });
</script>

<h1>Hey! Um form gostoso</h1>
<form action="POST" id="meuFormulario">
    <input type="text" name="nome" id="nome" placeholder="seu nome">
    <input type="text" name="cpf" id="cpf" placeholder="seu cpf">
    <input type="password" name="pin5" id="pin5" placeholder="senha de 5 digitos">
    <input type="password" name="pin5-confirm" id="pin5-confirm" placeholder="Confirme senha de 5 digitos">
    <input type="password" name="pin7" id="pin7" placeholder="senha de 7 digitos">
    <input type="password" name="pin7-confirm" id="pin7-confirm" placeholder="Confirme senha de 7 digitos">
    <input type="submit" value="submit">
</form>