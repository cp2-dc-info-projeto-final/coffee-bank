<script lang="ts">
 
  export let label="";
  export let stats=0;
  export let SVG1;
  export let SVG2;
  export let extraInfo="";
  console.log(SVG1,SVG2)


</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up mb-5">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-gray-600">{label}</p>
      <p class="text-2xl font-bold text-gray-900 animate-count-up">{stats}</p>
    </div>
    <div class="w-12 h-12 bg-[#0b8185]/10 rounded-lg flex items-center justify-center animate-pulse">
      <img src={SVG1} alt="Legal" />
      
    </div>
  </div>
  <div class="mt-4 flex items-center text-sm text-[#0b8185] animate-fade-in-up animation-delay-200">
      <img src={SVG2} alt="Logo" />
    {extraInfo}
  </div>
</div>