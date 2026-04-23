import { createApp, h } from 'vue';
import ifNode from './if-node.vue'; 
import LogicFlow ,{HtmlNode, HtmlNodeModel,GraphModel,type Model,BaseNodeModel} from '@logicflow/core'; 
type NodeConfig = LogicFlow.NodeConfig;
import { randomNumber } from '../../utils';
export default function registerConnect(lf: LogicFlow) {
  lf.register('ifNode', () => {
    class htmlIfNode extends HtmlNode {
     override setHtml(rootEl:SVGForeignObjectElement) {
        const { model } = this.props;
        const el = document.createElement('div');
        rootEl.innerHTML = '';
        rootEl.appendChild(el);
        // Vue 3 使用 createApp 来创建应用实例
        const app = createApp({
          render: () =>
            h(ifNode, {
              properties: model.properties,
            }),
        });
        // 挂载 Vue 应用到元素上
        app.mount(el);
      }
    }
    class htmlIfModel extends HtmlNodeModel {
      override  createId() {
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
     override getDefaultAnchor() {
        const { id, x, y, width} = this;
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
      
     override initNodeData(data:NodeConfig) {
        super.initNodeData(data);
        this.properties = {
            nodeType: 'if',
        };
        this.width = 168
        this.height = 42
        this.radius = 50; 
        
      }
     override getConnectedTargetRules(): Model.ConnectRule[] {
       const rules = super.getConnectedTargetRules();
        const targetRules = {
          message: `【条件节点】只允许一个输入`,
          validate: (_, targetNode:BaseNodeModel) => {
            const edges = this.graphModel.getNodeIncomingEdge(targetNode.id);
            if (edges.length >= 1) { 
               return false;
            } else {
               return true;
            }
          }
        } as Model.ConnectRule
        rules.push(targetRules);
       return rules;
     }

      override getConnectedSourceRules(): Model.ConnectRule[] {
           const rules = super.getConnectedSourceRules();
           const sourceRules  = [{
              message: `【条件节点】只允许2个输出`,
              validate: (sourceNode:HtmlNodeModel) => { //,targetNode:BaseNodeModel, sourceAnchor :Model.AnchorConfig, targetAnchor:Model.AnchorConfig
                const edges = this.graphModel.getNodeOutgoingEdge(sourceNode.id);
                if (edges.length >= 2) {
                  return false;
                } else {
                  return true;
                }
              },
            },{
              message: `【条件节点】不允许连接【条件节点】`,
              validate: (_,targetNode:HtmlNodeModel) => {
                if("ifNode" === String(targetNode.type)){
                    return false;
                }else{
                   return true;
                } 
              }
            }
            ] as  Model.ConnectRule[];
           rules.push(...sourceRules);
           return rules;
      }
    }
    return {
      type: 'ifNode',
      view: htmlIfNode,
      model: htmlIfModel,
    };
  });
}
