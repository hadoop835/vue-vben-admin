import { createApp, h } from 'vue';
import endNode from './end-node.vue';
import LogicFlow from '@logicflow/core';
import { randomNumber } from '../../utils';
export default function registerConnect(lf: LogicFlow) {
  lf.register('endNode', ({ HtmlNode, HtmlNodeModel }) => {
    class endHtmlNode extends HtmlNode {
      setHtml(rootEl) {
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
      createId() {
        return randomNumber();
      }
      constructor(data, graphModel) {
        super(data, graphModel);
        this.menu = [];
      }
      getDefaultAnchor() {
        const { id, x, y, width, height } = this;
        const anchors = [];
        anchors.push({
          x: x - width / 2,
          y: y,
          id: `${id}_left`,
          type: 'left',
        });
        return anchors;
      }
      initNodeData(data) {
        super.initNodeData(data);
        const width = 168;
        const height = 50;
        this.width = width;
        this.height = height;
        this.radius = 50;
        this.sourceRules = [
          {
            message: '【结束节点】不允许连接输出',
            validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
              ElMessage.error('【结束节点】不允许连接输出');
              return false;
            },
          },
        ];
      }
    }
    return {
      view: endHtmlNode,
      model: endHtmlModel,
    };
  });
}
