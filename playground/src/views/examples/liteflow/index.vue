<template>
  <Liteflow @on-properties="onProperties" :data="formData.options" title="销售订单流程">
    
  </Liteflow>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { Liteflow } from '@vben/liteflow';  
const formData = reactive({
  title: '',
  options:[{
            label: "订单创建1",
            value:"b"
       }]
});

const onProperties=(data:any)=>{
    console.log(data)
}
 
</script>
