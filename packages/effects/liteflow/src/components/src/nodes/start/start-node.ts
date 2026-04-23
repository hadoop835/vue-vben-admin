import { createApp, h } from 'vue';
import startNode from './start-node.vue';
import { randomNumber } from '../../utils';
import LogicFlow ,{HtmlNode, HtmlNodeModel,GraphModel,type Model,BaseNodeModel} from '@logicflow/core'; 
type NodeConfig = LogicFlow.NodeConfig;
export default function registerConnect(lf: LogicFlow) {
  lf.register('startNode', () => {
    class startHtmlNode extends HtmlNode {
     override  setHtml(rootEl:SVGForeignObjectElement) {
        const { model } = this.props;
        const el = document.createElement('div');
        rootEl.innerHTML = '';
        rootEl.appendChild(el);
        // Vue 3 使用 createApp 来创建应用实例
        const app = createApp({
          render: () =>
            h(startNode, {
              properties: model.properties,
            }),
        });
        // 挂载 Vue 应用到元素上
        app.mount(el);
      }
    }


    class startHtmlModel extends HtmlNodeModel {
      override  createId() {
        return randomNumber();
      }
      constructor(data: NodeConfig, graphModel: GraphModel) {
        super(data, graphModel);
        this.menu = [];
      }
      override  getDefaultAnchor() {
        const { id, x, y, width } = this;
        const anchors = [];
        anchors.push({
          x: x + width / 2,
          y: y,
          id: `${id}_right`,
          type: 'right',
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
      override getConnectedTargetRules(): Model.ConnectRule[] {
        const rules = super.getConnectedTargetRules();
         const targetRules = [{
          message: '【开始节点】不允许连接输入',
          validate: () => {
            return false;
          },
        }] as Model.ConnectRule[]
         rules.push(...targetRules);
        return rules;
      }
 
       override getConnectedSourceRules(): Model.ConnectRule[] {
            const rules = super.getConnectedSourceRules();
            const sourceRules  = [] as  Model.ConnectRule[];
            rules.push(...sourceRules);
            return rules;
       }
    }
    return {
      view: startHtmlNode,
      model: startHtmlModel,
    };
  });
}
