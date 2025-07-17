<script lang="ts">
    import { onMount } from 'svelte';
    import UserList from '../../../Components/userList.svelte';
	import api from '$lib/api';
    
    
</script>

<div>
    
   <UserList {...users}/>
</div>
