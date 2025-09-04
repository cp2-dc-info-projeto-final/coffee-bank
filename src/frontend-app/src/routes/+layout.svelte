<script lang="ts">
    import imagem from "../assets/images/Logo.png"
	import '../app.css';
	import 'flowbite';
	let { children } = $props();
</script>
  
<div class="min-h-screen">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<div class="min-h-screen flex flex-1 flex-col" style={"background-color: #240f00;"}>
	<nav class="bg-amber-950 border-gray-200 dark:bg-gray-900 w-[100%]">
		<div class="flex flex-wrap items-center justify-between p-4 w-full mx-auto">

		  <div class="w-full flex flex-row justify-between items-center" id="navbar-default">
			<img src={imagem} class="w-10 h-10 md:h-20 md:w-20" alt="Flowbite Logo" />
			<ul class="items-center font-medium flex p-0 mt-4 rounded-lg flex-row space-x-8 rtl:space-x-reverse">
			  <li>
				<a href="/" class="block py-2 px-3 text-white rounded-sm bg-transparent dark:text-white" aria-current="page"><i class="text-2xl fa-solid fa-house"></i></a>
			  </li>
			  <li>
				<a href="/Cadastro" class="block py-2 px-3 text-white rounded-sm bg-transparent dark:text-white" aria-current="page"><i class="text-2xl fa-solid fa-door-open"></i></a>
			  </li>
			  <li>
				<a href="/gerenciamento" class="block py-2 px-3 text-white rounded-sm bg-transparent dark:text-white" aria-current="page"><i class="text-2xl fa-solid fa-user-tie"></i></a>
			  </li>
			</ul>
		  </div>
		</div>
	  </nav>
	{@render children()}
	</div>	
</div>
