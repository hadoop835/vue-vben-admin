import { createApp, h } from 'vue';
import endNode from './end-node.vue';
import LogicFlow ,{HtmlNode, HtmlNodeModel,GraphModel,type Model,BaseNodeModel} from '@logicflow/core'; 
type NodeConfig = LogicFlow.NodeConfig;
import { randomNumber } from '../../utils';
export default function registerConnect(lf: LogicFlow) {
  lf.register('endNode', () => {
    class endHtmlNode extends HtmlNode {
      override setHtml(rootEl:SVGForeignObjectElement) {
        const { model } = this.props;
        const el = document.createElement('div');
        rootEl.innerHTML = '';
        rootEl.appendChild(el);
        // Vue 3 使用 createApp 来创建应用实例
        const app = createApp({
          render: () =>
            h(endNode, {
              properties: model.properties,
            }),
        });
        // 挂载 Vue 应用到元素上
        app.mount(el);
      }
    }
    class endHtmlModel extends HtmlNodeModel {
     override  createId() {
        return randomNumber();
      }
      constructor(data: NodeConfig, graphModel: GraphModel) {
        super(data, graphModel);
        this.menu = [];
      }
     override getDefaultAnchor() {
        const { id, x, y, width } = this;
        const anchors = [];
        anchors.push({
          x: x - width / 2,
          y: y,
          id: `${id}_left`,
          type: 'left',
        });
        return anchors;
      }
      override setAttributes(): void {
        this.width = 168
        this.height=42;
    }

     override initNodeData(data:NodeConfig) {
        super.initNodeData(data);
        this.width = 168
        this.height=42;
        this.radius = 50;
         
      }

      override getConnectedSourceRules(): Model.ConnectRule[] {
        const rules = super.getConnectedSourceRules();
        const sourceRules  = [{
           message: `【结束节点】不允许连接输出`,
           validate: () => { //,targetNode:BaseNodeModel, sourceAnchor :Model.AnchorConfig, targetAnchor:Model.AnchorConfig
            return false;
           },
         }] as  Model.ConnectRule[];
        rules.push(...sourceRules);
        return rules;
       } 
    }
    return {
      view: endHtmlNode,
      model: endHtmlModel,
    };
  });
}
