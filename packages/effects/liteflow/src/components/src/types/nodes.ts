const nodeTypeDef: any = {
  start: {
    type: 'startNode',
    text: '开始',
    color: '#ffffff',
    icon: 'start',
  },
  end: {
    type: 'endNode',
    text: '结束',
    color: '#ffffff',
    icon: 'end',
  },
  if: {
    type: 'ifNode',
    text: '布尔节点',
    color: '#ffffff',
    icon: 'if',
  },
  switch: {
    type: 'switchNode',
    text: '选择节点',
    color: '#ffffff',
    icon: 'switch',
  },
  when: {
    type: 'whenNode',
    text: '并行节点',
    color: '#ffffff',
    icon: 'when',
  },
  summary: {
    type: 'summaryNode',
    text: '合并节点',
    color: '#ffffff',
    icon: 'summary',
  },
  for: {
    type: 'forNode',
    text: 'For循环',
    color: '#ffffff',
    icon: 'for',
  },
  iterator: {
    type: 'iteratorNode',
    text: 'iterator循环',
    color: '#ffffff',
    icon: 'iterator',
  },
  common: {
    type: 'commonNode',
    text: '普通节点',
    color: '#ffffff',
    icon: 'common',
  },
};

const groupMap = [
  { text: '开关节点', value: 'switch', nodes: ['start', 'end'] },
  {
    text: '编排节点',
    value: 'gateway',
    nodes: ['when', 'common', 'switch', 'if', 'summary'],
  },
  { text: '循环节点', value: 'loop', nodes: ['for', 'iterator'] },
];

export { nodeTypeDef, groupMap };
