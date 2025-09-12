<script lang="ts">

import UserList from '../../Components/userList.svelte';
      import { goto } from '$app/navigation';
    
    
</script>

<div class="min-h-screen md:mx-10 md:my-">
    
   <UserList />

   <a href="/admin" class="block py-2 px-3 text-white rounded-sm bg-transparent dark:text-white" aria-current="page"><i class="text-2xl fa-solid fa-money-bill-trend-up relative z-11"></i></a>
</div>
