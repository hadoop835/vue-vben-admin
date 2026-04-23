<template>
  <div
    class="border-t overflow-hidden bg-white shadow"
    v-for="group in groupMap"
  >
    <span
      class="w-full px-5 py-4 flex justify-between items-center font-medium overflow-hidden"
    >
      {{ group.text }}
    </span>
    <div class="px-5 py-4 border-t">
      <div
        class="overflow-hidden flex w-38 border items-center justify-between font-medium p-2 cursor-pointer rounded-[5px] flex-1 my-2 hover:bg-[#deeff5] hover:border-[#0099ff]"
        @selectstart.prevent
        v-for="nodeType in group.nodes"
        :key="nodeType"
        @mousedown="mousedownFunc(nodeTypeDef[nodeType])"
      >
        <div class="flex items-center gap-3 mx-auto">
          <SvgLiteflowStartIcon
            v-if="nodeTypeDef[nodeType].icon == 'start'"
          ></SvgLiteflowStartIcon>
          <SvgLiteflowEndIcon
            v-if="nodeTypeDef[nodeType].icon == 'end'"
          ></SvgLiteflowEndIcon>
          <SvgLiteflowWhenIcon
            v-if="nodeTypeDef[nodeType].icon == 'when'"
          ></SvgLiteflowWhenIcon>
          <SvgLiteflowForIcon
            v-if="nodeTypeDef[nodeType].icon == 'for'"
          ></SvgLiteflowForIcon>
          <SvgLiteflowSwitchIcon
            v-if="nodeTypeDef[nodeType].icon == 'switch'"
          ></SvgLiteflowSwitchIcon>
          <SvgLiteflowIteratorIcon
            v-if="nodeTypeDef[nodeType].icon == 'iterator'"
          ></SvgLiteflowIteratorIcon>
          <SvgLiteflowIfIcon
            v-if="nodeTypeDef[nodeType].icon == 'if'"
          ></SvgLiteflowIfIcon>
          <SvgLiteflowSummaryIcon
            v-if="nodeTypeDef[nodeType].icon == 'summary'"
          ></SvgLiteflowSummaryIcon>
          <SvgLiteflowCommonIcon
            v-if="nodeTypeDef[nodeType].icon == 'common'"
          ></SvgLiteflowCommonIcon>
          <span>{{ nodeTypeDef[nodeType].text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LogicFlow from '@logicflow/core';
import { reactive } from 'vue';
import { nodeTypeDef, groupMap } from '../types/nodes';
import {
  SvgLiteflowStartIcon,
  SvgLiteflowEndIcon,
  SvgLiteflowWhenIcon,
  SvgLiteflowForIcon,
  SvgLiteflowSwitchIcon,
  SvgLiteflowIteratorIcon,
  SvgLiteflowIfIcon,
  SvgLiteflowSummaryIcon,
  SvgLiteflowCommonIcon,
} from '@vben/icons';

const props = defineProps({
  lf: {
    type: LogicFlow,
  } as any,
});

let dragRow = reactive({
    type: '',
});

const mousedownFunc = (data: any) => {
  dragRow = data;
  props.lf.dnd.startDrag({
    type: data.type,
    text: data.text,
  });
};

</script>
