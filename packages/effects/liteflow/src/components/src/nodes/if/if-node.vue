<template>
  <div
    ref="startNode"
    class="overflow-hidden flex w-42 border items-center justify-between font-medium  cursor-pointer rounded-[5px] bg-[#FFFFFF] border-[#e6f7ff]"
  >
    <div
      class="flex items-center justify-center gap-5 mx-auto whitespace-nowrap"
    >
      <SvgLiteflowIfIcon class="-ml-20"></SvgLiteflowIfIcon>
      <span class="text-center leading-none p-5"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SvgLiteflowIfIcon } from '@vben/icons';
const startNode = ref(null);
onMounted(() => {});
</script>
