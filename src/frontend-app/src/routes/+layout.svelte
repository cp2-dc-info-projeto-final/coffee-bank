<script lang="ts">
	import '../app.css';
	import 'flowbite';
	let { children } = $props();
</script>
<div class="min-h-screen">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<div class="min-h-screen flex flex-1 flex-col" style={"background-color: ##190a03;"}>
		{@render children()}
	</div>
</div>
