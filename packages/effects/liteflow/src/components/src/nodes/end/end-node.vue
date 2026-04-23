<template>
  <div
    ref="startNode"
    class="overflow-hidden flex w-42 border items-center justify-between font-medium  cursor-pointer rounded-[5px] bg-[#FFFFFF] border-[#e6f7ff]"
  >
    <div
      class="flex items-center justify-center gap-5 mx-auto whitespace-nowrap"
    >
      <SvgLiteflowEndIcon class="-ml-20"></SvgLiteflowEndIcon>
      <span class="text-center leading-none p-5"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SvgLiteflowEndIcon } from '@vben/icons';
const startNode = ref(null);
onMounted(() => {});
</script>
