import { createApp, h } from 'vue';
import forNode from './for-node.vue';
import LogicFlow ,{HtmlNode, HtmlNodeModel,GraphModel,type Model,BaseNodeModel} from '@logicflow/core'; 
type NodeConfig = LogicFlow.NodeConfig;
import { randomNumber } from '../../utils';
export default function registerConnect(lf: LogicFlow) {
  lf.register('forNode', () => {
    class htmlForNode extends HtmlNode {
      override setHtml(rootEl :SVGForeignObjectElement) {
        const { model } = this.props;
        const el = document.createElement('div');
        rootEl.innerHTML = '';
        rootEl.appendChild(el);
        // Vue 3 使用 createApp 来创建应用实例
        const app = createApp({
          render: () =>
            h(forNode, {
              properties: model.properties,
            }),
        });
        // 挂载 Vue 应用到元素上
        app.mount(el);
      }
    }
    class htmlForModel extends HtmlNodeModel {
      override createId() {
        return randomNumber(); //id用随机数数字
      }
      constructor(data: NodeConfig, graphModel: GraphModel) {
        super(data, graphModel);
        this.menu = [
          {
            text: '删除',
            callback(node:any) {
              lf.deleteNode(node.id);
            },
          },
          {
            text: '复制',
            callback(node:any) {
              lf.cloneNode(node.id);
            },
          },
        ];
      }
     override  getDefaultAnchor() {
        const { id, x, y, width } = this;
        const anchors = [];
        anchors.push({
          x: x - width / 2,
          y,
          id: `${id}_incomming`,
          type: 'incomming',
        });
        anchors.push({
          x: x + width / 2,
          y,
          id: `${id}_outgoing`,
          type: 'outgoing',
        });
        return anchors;
      }

      override setAttributes(): void {
        this.width = 168
        this.height=42;
      }

     override  initNodeData(data:NodeConfig) {
        super.initNodeData(data);
        const width = 168;
        const height = 50;
        this.width = width;
        this.height = height;
        this.properties = {
          nodeType: 'SUMMARY',
        };
        this.radius = 50;
        this.targetRules = [];
        this.sourceRules = [];
      }

      override getConnectedTargetRules(): Model.ConnectRule[] {
        const rules = super.getConnectedTargetRules();
         const targetRules = [] as Model.ConnectRule[]
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
      view: htmlForNode,
      model: htmlForModel,
    };
  });
}
