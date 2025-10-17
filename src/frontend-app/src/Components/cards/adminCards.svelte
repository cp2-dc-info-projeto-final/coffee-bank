<script lang="ts">
  export let label="";
  export let stats=0;
  export let svg1="";
  export let svg2="";
  export let extraInfo="";

  function formatNumber(value: number) {
    return new Intl.NumberFormat('pt-BR').format(value);
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-gray-600">{label}</p>
      <p class="text-2xl font-bold text-gray-900 animate-count-up">{formatNumber(stats)}</p>
    </div>
    <div class="w-12 h-12 bg-[#0b8185]/10 rounded-lg flex items-center justify-center animate-pulse">
      {svg1}  
      
    </div>
  </div>
  <div class="mt-4 flex items-center text-sm text-[#0b8185] animate-fade-in-up animation-delay-200">
    {svg2}
    {extraInfo}
  </div>
</div>