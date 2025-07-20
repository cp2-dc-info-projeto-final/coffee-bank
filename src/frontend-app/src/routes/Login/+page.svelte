<script>
    import { onMount } from 'svelte';
    import axios from 'axios';

    onMount(() => {
        const cpfInput = document.getElementById('cpf');
        const form = document.getElementById("form");
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

            });
        form.addEventListener("submit", async function (e) {
            alert("entrou")
            e.preventDefault(); // Impede o envio padrão do form
            const data = {
                Senha5: document.getElementById("password").value,
                CPF: document.getElementById("cpf").value
            }
            try{
                const response = await axios.put("http://localhost:3000/users/Login", data);
                if(response.data.success){
                    alert("login realizado com sucesso!");
                    alert(data)
                } else {
                    console.log(data,response.data)
                    alert(response.data.message);
                }
            } catch (error) {
                console.error("Erro ao fazer login:", error);
                alert(data)
            }
        })
    });
</script>
<section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col min-h-screen items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0" id="login">
    <div class="w-full shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6 rounded-3xl bg-white space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Login para acesso
        </h1>
        <form class="space-y-4 md:space-y-6" method="POST" id="form">
          <!-- Campo CPF -->
          <div>
            <label for="cpf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seu CPF</label>
            <input type="text" name="cpf" id="cpf" placeholder="123.456.789-10"
              class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required>
          </div>

          <!-- Campo Senha 5 -->
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sua Senha 5</label>
            <input type="password" name="password" id="password" placeholder="•••••"
              class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required>
          </div>

          <!-- Checkbox Lembrar de mim -->
          <div class="flex items-start space-x-2">
            <input id="remember" type="checkbox"
              class="w-4 h-4 border border-gray-300 rounded focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800">
            <label for="remember" class="text-sm text-gray-900 dark:text-white">Lembrar de mim</label>
          </div>

          <!-- Link Esqueceu a senha -->
          <div>
            <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Esqueceu sua senha?</a>
          </div>

          <!-- Botão Confirmar -->
          <button type="submit"
            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Clique Para Confirmar
          </button>

          <!-- Link Criar Conta -->
          <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Sem uma conta ainda?
            <a href="#pa" class="font-medium text-blue-600 hover:underline dark:text-blue-500">Crie uma aqui!</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</section>
<style>
    #login{
        background-image: url("../../assets/images/login.png");
        background-size: cover;
        background-position: center;
    }
</style>