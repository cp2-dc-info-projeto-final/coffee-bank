<script>
    export let Content = "";
    export let Name = "";
    export let id = "";
    export let type = "text";
    export let color = "";
</script>

<div>
    <div class="relative z-0 w-full mb-5 group">
        <input 
            type={type}
            name={Name} 
            id={id} 
            placeholder=" " 
            class="block py-2.5 px-0 w-full text-sm text-{color} bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        />
        <label 
            for={id} 
            class="peer-focus:font-medium absolute text-sm text-{color} duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            {Content}
        </label>
    </div>
</div>
