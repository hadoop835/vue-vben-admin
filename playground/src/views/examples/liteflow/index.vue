<template>
  <Liteflow @on-properties="onProperties">
    <template #property>
      <Form :model="formData">
        <FormItem label="节点名称">
          <Input v-model:value="formData.title" />
        </FormItem>
      </Form>
    </template>
  </Liteflow>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { Liteflow } from '@vben/liteflow';
import { Input, Form, FormItem } from 'ant-design-vue';
const nodeId = ref('');
const lf = ref();

const formData = reactive({
  title: '',
});

const onProperties = (props) => {
  formData.title = props.data?.text?.value;
  nodeId.value = props.data.id;
  lf.value = props.lf;
};

watch(
  formData,
  (newVal) => {
    // console.log('表单任意属性变化了' + nodeId.value, newVal);
    lf.value.setProperties(nodeId.value, { name: newVal.title });
    lf.value.updateText(nodeId.value, newVal.title);

    //console.log(lf.value);
    // 这里可以做：实时保存、校验、联动
  },
  { deep: true }, // 监听对象必须加 deep
);
</script>
