<script lang="ts">
	import '../app.css';
	import 'flowbite';
	let { children } = $props();
</script>
<div class="min-h-screen">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<div class="min-h-screen bg-gradient-to-r from-gray-900 to-amber-900/20 flex flex-1 flex-col">
		{@render children()}
	</div>
</div>
