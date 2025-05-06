<template>
  <div class="flex flex-row h-screen overflow-hidden">
    <div class="flex flex-col w-1/4 border-r-[1px] border-slate-200">
      <Aside />
    </div>

    <div class="flex-1 overflow-y-auto no-scrollbar">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Aside from './components/Aside.vue';
</script>

<style>
input, textarea{
  outline: none;
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none; 
    scrollbar-width: none; 
}
.post-page p{
  margin-bottom: 1rem;
}
</style>