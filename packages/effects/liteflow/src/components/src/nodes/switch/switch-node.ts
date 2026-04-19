import { createApp, h } from 'vue';
import switchNode from './switch-node.vue';
import LogicFlow from '@logicflow/core';
import { randomNumber } from '../../utils';
export default function registerConnect(lf: LogicFlow) {
  lf.register('switchNode', ({ HtmlNode, HtmlNodeModel }) => {
    class htmlSwitchNode extends HtmlNode {
      setHtml(rootEl) {
        const { model } = this.props;
        const el = document.createElement('div');
        rootEl.innerHTML = '';
        rootEl.appendChild(el);

        // Vue 3 使用 createApp 来创建应用实例
        const app = createApp({
          render: () =>
            h(switchNode, {
              properties: model.properties,
            }),
        });
        // 挂载 Vue 应用到元素上
        app.mount(el);
      }
    }
    class htmlSwitchModel extends HtmlNodeModel {
      createId() {
        return randomNumber(); //id用随机数数字
      }
      constructor(data, graphModel) {
        super(data, graphModel);
        this.menu = [
          {
            text: '删除',
            callback(node) {
              lf.deleteNode(node.id);
            },
          },
          {
            text: '复制',
            callback(node) {
              lf.cloneNode(node.id);
            },
          },
        ];
      }
      getDefaultAnchor() {
        const { id, x, y, width, height } = this;
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
      initNodeData(data) {
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
    }
    return {
      view: htmlSwitchNode,
      model: htmlSwitchModel,
    };
  });
}
