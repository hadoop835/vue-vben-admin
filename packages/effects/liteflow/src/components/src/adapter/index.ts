export interface LogicFlowEdge {
  sourceNodeId: string;
  targetNodeId: string;
}

export interface LogicFlowNode {
  id: string;
  type:
    | 'whenNode'
    | 'switchNode'
    | 'commonNode'
    | 'startNode'
    | 'summaryNode'
    | 'endNode';
  text?: any;
  properties?: any;
}

export interface LogicFlowData {
  nodes: LogicFlowNode[];
  edges: LogicFlowEdge[];
}

//liteflow

export type LiteFlowNodeType =
  | 'then'
  | 'switch'
  | 'case'
  | 'when'
  | 'node'
  | 'start'
  | 'summary'
  | 'end';

export interface LiteFlowNode {
  id?: string;
  name?: string;
  type?: LiteFlowNodeType;
  children?: LiteFlowNode[];
}

export function convertLogicFlowToLiteFlowTree(
  data: LogicFlowData,
): LiteFlowNode {
  
  const { nodes, edges } = data;
  // 构建节点映射
  const nodeMap = new Map<string, LogicFlowNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // 构建出度
  const outgoings = new Map<string, string[]>();
  edges.forEach((e) => {
    if (!outgoings.has(e.sourceNodeId)) {
      outgoings.set(e.sourceNodeId, []);
    }
    outgoings.get(e.sourceNodeId)!.push(e.targetNodeId);
  });

  // 找到开始节点（只有一个，无入度）
  const allTargetIds = new Set(edges.map((e) => e.targetNodeId));
  const startNode = nodes.find((n) => !allTargetIds.has(n.id))!;

  // 递归构建流程树
  function build(nodeId: string): LiteFlowNode {
    const node = nodeMap.get(nodeId);
    if (!node) return { id: nodeId, name: node?.text?.value };
    const nextIds = outgoings.get(nodeId) || ([] as any);

    // 1. 菱形 = 判断节点 → SWITCH
    if (node.type === 'switchNode') {
      return {
        id: node.id,
        type: 'switch',
        name: node?.text?.value,
        children: nextIds.map((targetId: any) => ({
          type: 'case',
          id: targetId,
          nodes: [build(targetId)],
        })),
      };
    }

    // 2. 矩形 + 一个出口 → THEN
    if (node.type === 'commonNode' && nextIds.length === 1) {
      return {
        type: 'then',
        id: node.id,
        name: node.text.value,
        children: [build(nextIds[0])],
      };
    }

    if (node.type === 'startNode' && nextIds.length === 1) {
      return {
        type: 'start',
        id: node.id,
        name: node.text.value,
        children: [build(nextIds[0])],
      };
    }

    if (node.type === 'summaryNode' && nextIds.length === 1) {
      return {
        type: 'summary',
        id: node.id,
        name: node.text.value,
        children: [build(nextIds[0])],
      };
    }

    if (node.type === 'endNode' && nextIds.length === 0) {
      return {
        type: 'end',
        id: node.id,
        name: node.text.value,
      };
    }

    // 3. 矩形 + 多个出口 → WHEN（并行）
    if (node.type === 'whenNode' && nextIds.length > 1) {
      return {
        type: 'when',
        id: node.id,
        name: node.text.value,
        children: nextIds.map((n: any) => build(n)),
      };
    }
    // 4. 结束节点
    return { id: node.id };
  }
  return build(startNode.id);
}
