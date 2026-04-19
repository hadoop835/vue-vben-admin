<template>
  <!-- 父容器：占满整个屏幕高度 -->
  <div class="flex flex-col">
    <!-- 顶部：固定高度 -->
    <div class="h-16 flex items-center justify-center pl-2">
      <toolbar></toolbar>
    </div>

    <!-- 中间：自适应高度（核心） -->
    <div class="flex w-full bg-gray-100 pl-2 overflow-hidden">
      <!-- 左侧：固定宽度 -->
      <div class="w-52 bg-red-200 text-center p-2">
        <dnd v-if="showLf" :lf="lfInstance"></dnd>
      </div>
      <!-- 中间：自适应宽度（核心：flex-1） -->
      <div class="flex-1 flex text-center pr-3">
        <div class="flex-1 text-center pr-3">
          <div ref="container" style="width: 100%; height: 100%"></div>
        </div>
        <div class="w-0 items-center justify-center border border-gray-300">
          <div
            class="w-[24px] h-[24px] rounded-full bg-[#ffffff] relative z-50 -ml-3 top-[50%] shadow-md flex items-center justify-center"
            @click="toggleCollapsed"
          >
            <SvgSplitLeft v-if="isCollapsed"></SvgSplitLeft>
            <SvgSplitRight v-else></SvgSplitRight>
          </div>
        </div>
      </div>
      <!-- 右侧：固定宽度 -->
      <div class="w-58 text-center flex" v-show="!isCollapsed">
        <div class="flex-1 text-center h-full">
          <div class="h-full flex flex-col border rounded bg-white">
            <!-- 头 -->
            <div class="p-3 border-b bg-gray-50">属性设值</div>
            <!-- 内容（自动高度） -->
            <div class="flex-1 p-4 overflow-auto">
              <slot name="property"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, reactive } from 'vue';
import LogicFlow from '@logicflow/core';
import { Menu, Snapshot, MiniMap } from '@logicflow/extension';
import { SvgSplitLeft, SvgSplitRight } from '@vben/icons';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import dnd from './layout/dnd.vue';
import toolbar from './layout/toolbar.vue';
import startNode from './nodes/start/start-node';
import whenNode from './nodes/when/when-node';
import commonNode from './nodes/common/common-node';
import switchNode from './nodes/switch/switch-node';
import ifNode from './nodes/if/if-node';
import summaryNode from './nodes/summary/summary-node';
import forNode from './nodes/for/for-node';
import iteratorNode from './nodes/iterator/iterator-node';
import endNode from './nodes/end/end-node';
const container = ref<HTMLElement>();
const emits = defineEmits([
  'update:value',
  'on-init',
  'on-render',
  'on-save',
  'on-properties',
]);
const lfInstance = ref();
const showLf = ref(false);
const isCollapsed = ref(false); // 折叠状态

const props = withDefaults(defineProps<Props>(), {});

interface Props {}
//弹出框
const nodeData = ref({});
const isPanle = ref(false);

defineOptions({
  name: 'Liteflow',
});

defineSlots<{
  property: () => void;
}>();

const registerElements = (lf: LogicFlow) => {
  startNode(lf);
  whenNode(lf);
  commonNode(lf);
  switchNode(lf);
  ifNode(lf);
  summaryNode(lf);
  forNode(lf);
  iteratorNode(lf);
  endNode(lf);
};

const LfEvent = (lf: LogicFlow) => {
  lf.on('node:dbclick', ({ data }) => {
    nodeData.value = data;
    if (
      [
        'startNode',
        'endNode',
        'forNode',
        'iteratorNode',
        'commonNode',
        'ifNode',
        'switchNode',
        'whenNode',
        'summaryNode',
      ].includes(data.type)
    ) {
      emits('on-properties', { lf, data });
    }
  });
  lf.on('edge:dbclick', ({ data }) => {
    const nodeConfig = lf.getNodeDataById(data.sourceNodeId);
    if (nodeConfig?.type === 'if') {
      isPanle.value = true;
      data.properties = {
        if: true,
      };
      //nodeData.value = data;
    } else {
      showAttribute.value = false;
    }
    console.log('nodeConfig', data);
  });
  //来自边的事件中心发出的事件
  lf.on('edge:app-config', (data) => {
    nodeData.value = data;
    showAttribute.value = true;
  });
  lf.on('element:click', () => {});
  lf.on('blank:click', () => {});
  lf.on('connection:not-allowed', (data) => {});

  lf.on('edge:add', ({ data }) => {});

  lf.on('edge:delete', ({ data }) => {});
};

const customTheme = reactive({
  background: {
    backgroundColor: '#f0f4fb',
  },
  grid: {
    size: 10,
    type: 'dot',
    config: {
      color: '#ababab',
      thickness: 1,
    },
  },
  keyboard: {
    enabled: true,
  },
  adjustEdge: false, //允许调整边
  adjustEdgeStartAndEnd: false, //是否允许拖动边的端点来调整连线
  edgeSelectedOutline: true, //鼠标 hover 的时候显示边的外框
  // edgeTextDraggable: true,
  hoverOutline: false,
  nodeTextEdit: false, //节点是否可编辑。false不可编辑
  edgeTextEdit: false, //边是否可编辑。false不可编辑
  autoExpand: false, //点拖动靠近画布边缘时是否自动扩充画布
  textEdit: false, //是否开启文本编辑
  snapline: false, //对齐线。false不开启
});

onMounted(() => {
  if (!container.value) return;
  lfInstance.value = new LogicFlow({
    ...customTheme,
    container: container.value,
    plugins: [Menu, MiniMap, Snapshot],
    nodeText: {
      textAnchor: 'middle',
      textVerticalAlign: 'middle',
    },
  });
  const lf = lfInstance.value;
  showLf.value = true;
  registerElements(lf);
  LfEvent(lf);
  // 设置主题
  lf.setTheme({
    baseNode: {
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeWidth: 1,
    },
    circle: {
      stroke: '#000000',
      strokeWidth: 1,
    },
    rect: {
      fill: '#FFFFFF',
      stroke: '#000000',
      outlineColor: '#88f',
      strokeWidth: 1,
    },
    polygon: {
      strokeWidth: 1,
    },
    polyline: {
      stroke: '#000000',
      hoverStroke: '#000000',
      selectedStroke: '#000000',
      strokeWidth: 1,
    },
    nodeText: {
      color: '#000000',
      overflowMode: 'ellipsis', //超出显示省略号
      padding: '0 15px',
      fontSize: 14,
    },
    edgeText: {
      color: '#000000',
      background: {
        fill: '#f0f4fb',
      },
    },
  });
  // emits初始化事件
  emits('on-init', lf);

  const { eventCenter } = lf.graphModel;
  // 监听画布变化事件
  eventCenter.on('history:change', () => {
    //isHistoryChange.value = true
    emits('update:value', lf.getGraphData());
  });
  // 监听自定义的update:graphModel事件
  eventCenter.on('update:graphModel', () => {
    //isHistoryChange.value = true
    emits('update:value', lf.getGraphData());
  });
  // 监听自定义的update:graphData事件
  eventCenter.on('update:graphData', (data: any) => {
    // emits('update:value', data)
    liteFlowRender(data);
  });
  // 监听自定义的save事件
  eventCenter.on('custom:save', (data: any) => {
    emits('on-save', data);
  });
  liteFlowRender(props.value);
});

// watch(()=>props.value, (newVal)=>{
//   if(!isHistoryChange.value) {
//     myRender(newVal);
//   }
//   isHistoryChange.value = false
// }, {
//   deep: true
// })

/**
 * 自定义渲染
 * 1.默认渲染
 * 2.设置高亮属性
 * @param data
 */
const liteFlowRender = (data: any) => {
  const lf = lfInstance.value;
  if (!lf) return;
  lf.render(data);
  // emits render事件
  emits('on-render', lf);
};

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>
