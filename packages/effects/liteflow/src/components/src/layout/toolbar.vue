<template>
  <div class="flex-1 flex">
    <div class="flex-1 bg-white p-4">销售订单</div>
    <div class="w-[280px] bg-white p-4">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        保存
      </button>
      <span class="mr-5"></span>
      <button
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        保存并发布
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {}
</script>
