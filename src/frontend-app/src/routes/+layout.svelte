<script lang="ts">
	import '../app.css';
	import 'flowbite';
	let { children } = $props();
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<div class="min-h-screen" style={"background-color: #240f00;"}>
<nav class="bg-amber-950 border-gray-200 dark:bg-gray-900 w-[100%]">
	<div class="flex flex-wrap items-center justify-between p-4 w-full mx-auto">
	  <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
		  <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
		  <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">CoffeeBank</span>
	  </a>
	  <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
		  <span class="sr-only">Open main menu</span>
		  <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
			  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
		  </svg>
	  </button>
	  <div class="hidden w-full md:block md:w-auto" id="navbar-default">
		<ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
		  <li>
			<a href="/" class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page"><i class="fa-solid fa-house"></i></a>
		  </li>
		  <li>
			<a href="/Cadastro" class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page"><i class="fa-solid fa-door-open"></i></a>
		  </li>
		  <li>
			<a href="/gerenciamento" class="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page"><i class="fa-solid fa-user-tie"></i></a>
		  </li>
		</ul>
	  </div>
	</div>
  </nav>
{@render children()}
</div>
