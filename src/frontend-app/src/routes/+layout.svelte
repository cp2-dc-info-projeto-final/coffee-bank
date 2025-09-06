<script lang="ts">
    import imagem from "../assets/images/coffebank_noir-removebg-preview.png"
	import navBg from "../assets/images/premium_photo-1671612828903-dc019accc402.avif"
	import '../app.css';
	import 'flowbite';
	let { children } = $props();
</script>
  
<div class="min-h-screen">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<div class="min-h-screen flex flex-1 flex-col" style={"background-color: #240f00;"}>
		<nav class="relative  w-full  ">
			<div class="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1733342660123-10ab1ece90cb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-10 z-10"></div>
			<div class="flex flex-wrap items-center justify-between p-4 w-full mx-auto">

		  <div class="w-full flex flex-row justify-between items-center" id="navbar-default">
			<img src={imagem} class="w-10 h-10 md:h-20 md:w-20 z-11" alt="Flowbite Logo" />
			<ul class="items-center font-medium flex p-0 mt-4 rounded-lg flex-row space-x-8 rtl:space-x-reverse">
			  <li>
				<a href="/" class="block py-2 px-3 text-white rounded-sm bg-transparent dark:text-white" aria-current="page"><i class="text-2xl fa-solid fa-house relative z-11"></i></a>
			  </li>
			  <li>
				<a href="/Cadastro" class="block py-2 px-3 text-white rounded-sm bg-transparent dark:text-white" aria-current="page"><i class="text-2xl fa-solid fa-door-open relative z-11"></i></a>
			  </li>
			  <li>
				<a href="/gerenciamento" class="block py-2 px-3 text-white rounded-sm bg-transparent dark:text-white" aria-current="page"><i class="text-2xl fa-solid fa-user-tie relative z-11"></i></a>
			  </li>
				<li>
				<a href="/Investimentos" class="block py-2 px-3 text-white rounded-sm bg-transparent dark:text-white" aria-current="page"><i class="text-2xl fa-solid fa-money-bill-trend-up relative z-11"></i></a>
			  </li>
			</ul>
		  </div>
		</div>
	  </nav>
	{@render children()}
	</div>	
</div>
