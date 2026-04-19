import type { PropType } from 'vue';
import type {
  LiteFlowConfigData,
  LiteFlowThemeConfig,
  LiteFlowHighLightType,
  LiteFlowPatternItem,
  LiteFlowControlItem,
  LiteFlowFormType,
} from './index';

/**
 * 组件属性
 */
export const LiteFlowProps = {
  value: {
    type: Object as PropType<LiteFlowConfigData>,
    default() {
      return {};
    },
  },
  theme: {
    // 高亮主题配置
    type: Object as PropType<LiteFlowThemeConfig>,
    default() {
      return {};
    },
  },
  highLight: {
    // 高亮数据
    type: Object as PropType<LiteFlowHighLightType>,
    default() {
      return {};
    },
  },
  initDndPanel: {
    // 是否初始化拖拽面板
    type: Boolean,
    default: true,
  },
  dndPanel: {
    // 拖拽面板
    type: Array as PropType<Array<LiteFlowPatternItem>>,
  },
  initControl: {
    // 是否初始化控制面板
    type: Boolean,
    default: true,
  },
  control: {
    // 控制面板
    type: Array as PropType<Array<LiteFlowControlItem>>,
  },
  nodeClick: {
    // 节点点击事件
    type: Function,
  },
  edgeClick: {
    // 边点击事件
    type: Function,
  },
  blankContextmenu: {
    // 画布右键菜单
    type: Function,
  },
  drawerWidth: {
    // 抽屉宽度
    type: [String, Number] as PropType<string | number>,
    default: '600px',
  },
  modalWidth: {
    // 弹窗宽度
    type: [String, Number] as PropType<string | number>,
    default: '60%',
  },
  processForm: {
    // 流程表单配置
    type: Object as PropType<LiteFlowFormType>,
  },
  edgeForm: {
    // 边表单配置
    type: Object as PropType<LiteFlowFormType>,
  },
  defaultEdgeType: {
    // 默认边
    type: String,
    default: 'snaker:transition',
  },
  typePrefix: {
    // 自定义节点/边类型前缀,如snaker:task,snaker:transition，只是snaker:则为前辍
    type: String,
    default: 'snaker:',
  },
  viewer: {
    // 是否查看模式
    type: Boolean,
    default: false,
  },
};
