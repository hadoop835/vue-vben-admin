<template>
  <Liteflow @on-properties="onProperties" :data="formData.options" title="销售订单流程" @on-validate="validate">
    
  </Liteflow>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { Liteflow } from '@vben/liteflow'; 
import { notification  } from 'ant-design-vue';
import console from 'console';
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

const validate=(msg:String) => { 
   notification.error({message:msg})
}
</script>
