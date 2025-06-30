<h1>Hey! Um form gostoso</h1>
<form action="POST">
    <input type="text" name="nome" id="nome" placeholder="seu nome">
    <input type="text" name="cpf" id="cpf" placeholder="seu cpf">
    <input type="password" name="pin5" id="pin5" placeholder="senha de 5 digitos">
    <input type="password" name="pin5-confirm" id="pin5-confirm" placeholder="Confirme senha de 5 digitos">
    <input type="password" name="pin7" id="pin7" placeholder="senha de 7 digitos">
    <input type="password" name="pin7-confirm" id="pin7-confirm" placeholder="Confirme senha de 7 digitos">
    <input type="submit" value="submit">
</form>
<script>
    const labels= ["cpf", "nome", "pin5","pin7"]
    async function enviar(){
        // Obtém os dados do formulário
        const data = {
            // @ts-ignore
            pin5: document.getElementById("cpf").value,
            // @ts-ignore
            pin7: document.getElementById("nome").value,
            // @ts-ignore
            nome: document.getElementById("pin5").value,
            // @ts-ignore
            cpf: document.getElementById("pin7").value
        };

            // Envia os dados via POST
        fetch("./CreateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
    };
</script>