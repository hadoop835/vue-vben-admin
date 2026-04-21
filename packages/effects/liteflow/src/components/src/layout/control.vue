<script lang="ts" setup>
import { ref } from 'vue';

import {
  SvgLiteflowBackIcon,
  SvgLiteflowDowloadIcon,
  SvgLiteflowMapIcon,
  SvgLiteflowMinusIcon,
  SvgLiteflowNextIcon,
  SvgLiteflowPlusIcon,
  SvgLiteflowRatioIcon,
} from '@vben/icons';

import LogicFlow from '@logicflow/core';
import { MiniMap } from '@logicflow/extension';

const props = withDefaults(defineProps<Props>(), {});
const scale = ref(100);
const miniMapVisible = ref(true);
interface Props {
  lf: LogicFlow;
}
const $_zoomIn = () => {
  scale.value = Math.min(scale.value + 10, 100);
  if (scale.value < 100) {
    props.lf.zoom(true);
  }
};

const $_zoomOut = () => {
  scale.value = Math.max(scale.value - 10, 10);
  if (scale.value > 10) {
    props.lf.zoom(false);
  }
};

const $_reset = () => {
  props.lf.resetZoom();
  props.lf.resetTranslate();
};

const $_undo = () => {
  props.lf.undo();
};

const $_redo = () => {
  props.lf.redo();
};

const $_download = () => {
  props.lf.getSnapshot();
};
const $_showMiniMap = () => {
  const miniMap = props.lf.extension.miniMap as MiniMap;
  if (miniMapVisible.value) {
    miniMapVisible.value = false;
    miniMap.show();
    miniMap.setShowEdge(true);
  } else {
    miniMapVisible.value = true;
    miniMap.hide();
  }
};
</script>
<template>
  <!-- 组1：复制 + 对齐 -->
  <div
    class="flex items-center bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden h-[34px] w-[34px]"
  >
    <button
      @click="$_reset"
      class="flex items-center justify-center hover:bg-gray-100 transition w-6 h-6 m-auto"
    >
      <SvgLiteflowRatioIcon />
    </button>
  </div>

  <!-- 组2：返回 + 下一步 -->
  <div
    class="flex items-center bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden h-[34px] w-[88px]"
  >
    <button
      @click="$_undo"
      class="flex items-center justify-center hover:bg-gray-100 transition w-6 h-6 m-auto"
    >
      <SvgLiteflowBackIcon />
    </button>
    <button
      @click="$_redo"
      class="flex items-center justify-center hover:bg-gray-100 transition w-6 h-6 m-auto"
    >
      <SvgLiteflowNextIcon />
    </button>
  </div>

  <!-- 组3：缩放 -->
  <div
    class="flex items-center bg-white rounded-[5px] shadow-sm border border-gray-200 overflow-hidden h-[34px] w-[168px]"
  >
    <button
      @click="$_showMiniMap"
      class="flex items-center justify-center hover:bg-gray-100 transition w-6 h-6 m-auto"
    >
      <SvgLiteflowMapIcon />
    </button>
    <button
      @click="$_zoomOut"
      class="flex items-center justify-center hover:bg-gray-100 transition w-6 h-6 m-auto"
    >
      <SvgLiteflowMinusIcon />
    </button>
    <span class="px-3 py-2.5 text-sm font-medium min-w-[50px] text-center">{{ scale }}%</span>
    <button
      @click="$_zoomIn"
      class="flex items-center justify-center hover:bg-gray-100 transition w-6 h-6 m-auto"
    >
      <SvgLiteflowPlusIcon />
    </button>
  </div>

  <!-- 组4：下载 -->
  <div
    class="flex h-[34px] w-[34px] items-center bg-white rounded-[5px] shadow-sm border border-gray-200 overflow-hidden"
  >
    <button
      @click="$_download"
      class="flex items-center justify-center hover:bg-gray-100 transition w-6 h-6 m-auto"
    >
      <SvgLiteflowDowloadIcon />
    </button>
  </div>
</template>
