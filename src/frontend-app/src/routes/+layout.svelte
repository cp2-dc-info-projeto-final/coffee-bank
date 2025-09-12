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
		{@render children()}
	</div>
</div>
