<script lang="ts">
    import imagem from "../../assets/images/coffebank_noir-removebg-preview.png"
</script>
<nav class="relative  w-full my-0 divide-y-5 divide-amber-900 divide-solid">
    <div class="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1733342660123-10ab1ece90cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10 z-10"></div>
    <div class="flex flex-wrap items-center justify-between p-3 w-full mx-auto ">

  <div class="w-full flex flex-row justify-between items-center" id="navbar-default">
    <div class="flex flex-row justify-center items-center gap-1">
      <img src={imagem} class="w-10 h-10 ml-2 md:h-20 md:w-20 z-11" alt="CoffeeBank Logo" />
      <div class=" hidden sm:inline text-4xl text-white">Coffebank</div>
    </div>
    <ul class="items-center font-medium flex p-0 mt-4 rounded-lg flex-row space-x-8 rtl:space-x-reverse">
      <li>
        <a href="/LoginUser" class="block py-2 px-3 text-white rounded-sm bg-transparent" aria-current="page"><i class="text-2xl fa-solid fa-user relative z-11"></i></a>
      </li>
      <li>
        <a href="/" class="block py-2 px-3 text-white rounded-sm bg-transparent" aria-current="page"><i class="text-2xl fa-solid fa-house relative z-11"></i></a>
      </li>
      <li>
        <a href="/Cadastro" class="block py-2 px-3 text-white rounded-sm bg-transparent" aria-current="page"><i class="text-2xl fa-solid fa-door-open relative z-11"></i></a>
      </li>
      
    </ul>
  </div>
</nav>