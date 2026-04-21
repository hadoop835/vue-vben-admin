interface WorkflowNode {
  type: string;
  id: string;
  name: string;
  children?: WorkflowNode[];
}

class LiteFlowConverter {
  private nodeIdMap: Map<string, string> = new Map();

  private readonly SKIP_NODE_TYPES = new Set([
    'start',
    'end',
    'summary',
    'when',
  ]);

  convert(workflow: WorkflowNode): string {
    if (!workflow || !workflow.children || workflow.children.length === 0) {
      return '';
    }

    this.nodeIdMap.clear();
    const elExpression = this.buildExpressionFromChildren(workflow);

    if (!elExpression) {
      return '';
    }

    return `${elExpression};`;
  }

  private buildExpressionFromChildren(node: WorkflowNode): string {
    if (!node.children || node.children.length === 0) {
      return '';
    }

    const expressions: string[] = [];
    for (const child of node.children) {
      const expr = this.buildExpression(child);
      if (expr) {
        expressions.push(expr);
      }
    }

    if (expressions.length === 0) {
      return '';
    } else if (expressions.length === 1) {
      return expressions[0];
    } else {
      return `THEN(${expressions.join(', ')})`;
    }
  }

  private buildExpression(node: WorkflowNode): string {
    if (this.SKIP_NODE_TYPES.has(node.type)) {
      if (node.children && node.children.length > 0) {
        return this.handleSkippedNode(node);
      }
      return '';
    }

    if (node.type === 'then') {
      return this.handleThenNode(node);
    }

    if (node.type === 'if') {
      return this.handleIfNode(node);
    }

    if (node.type === 'switch') {
      return this.handleSwitchNode(node);
    }

    if (node.type === 'for') {
      return this.handleForNode(node);
    }

    return this.getNodeName(node);
  }

  private handleSkippedNode(node: WorkflowNode): string {
    if (!node.children || node.children.length === 0) {
      return '';
    }

    const children = node.children;

    if (node.type === 'when' || children.length > 1) {
      return this.handleParallelBranchesForSkippedNode(children);
    }

    return this.buildExpression(children[0]);
  }

  private handleParallelBranchesForSkippedNode(
    children: WorkflowNode[],
  ): string {
    const branchExpressions: string[] = [];

    for (const child of children) {
      const branchExpr = this.buildExpression(child);
      if (branchExpr) {
        branchExpressions.push(branchExpr);
      }
    }

    if (branchExpressions.length === 0) {
      return '';
    }

    if (branchExpressions.length === 1) {
      return branchExpressions[0];
    } else {
      return `WHEN(${branchExpressions.join(', ')})`;
    }
  }

  private handleThenNode(node: WorkflowNode): string {
    if (!node.children || node.children.length === 0) {
      return this.getNodeName(node);
    }

    const children = node.children;

    if (children.length > 1) {
      return this.handleParallelBranches(node, children);
    }

    // 单个子节点，收集当前节点和后续所有顺序节点
    const sequenceNodes: string[] = [this.getNodeName(node)];
    let currentNode: WorkflowNode | null = children[0];

    while (currentNode) {
      if (this.SKIP_NODE_TYPES.has(currentNode.type)) {
        // 跳过节点，处理其子节点
        if (currentNode.children && currentNode.children.length > 0) {
          if (currentNode.type === 'when' || currentNode.children.length > 1) {
            // 遇到并行，停止收集，处理并行
            const parallelExpr = this.handleSkippedNode(currentNode);
            if (parallelExpr) {
              sequenceNodes.push(parallelExpr);
            }
            break;
          } else {
            // 继续处理单个子节点
            currentNode = currentNode.children[0];
            continue;
          }
        } else {
          break;
        }
      }

      if (currentNode.type === 'then') {
        // then节点，添加到序列
        sequenceNodes.push(this.getNodeName(currentNode));

        if (currentNode.children && currentNode.children.length > 0) {
          if (currentNode.children.length > 1) {
            // 多个子节点，处理并行
            const parallelExpr = this.handleParallelBranches(
              currentNode,
              currentNode.children,
            );
            if (parallelExpr) {
              sequenceNodes.push(parallelExpr);
            }
            break;
          } else {
            // 单个子节点，继续
            currentNode = currentNode.children[0];
            continue;
          }
        } else {
          break;
        }
      } else {
        // 其他类型节点（if/switch/for等），添加并停止
        const expr = this.buildExpression(currentNode);
        if (expr) {
          sequenceNodes.push(expr);
        }
        break;
      }
    }

    if (sequenceNodes.length === 1) {
      return sequenceNodes[0];
    } else {
      return `THEN(${sequenceNodes.join(', ')})`;
    }
  }

  private handleIfNode(node: WorkflowNode): string {
    if (!node.children || node.children.length === 0) {
      return this.getNodeName(node);
    }

    const childExpressions = node.children
      .map((child) => this.buildExpression(child))
      .filter((expr) => expr !== '');

    if (childExpressions.length === 0) {
      return this.getNodeName(node);
    }

    return `IF(${this.getNodeName(node)}, ${childExpressions.join(', ')})`;
  }

  private handleSwitchNode(node: WorkflowNode): string {
    if (!node.children || node.children.length === 0) {
      return this.getNodeName(node);
    }

    const childExpressions = node.children
      .map((child) => this.buildExpression(child))
      .filter((expr) => expr !== '');

    if (childExpressions.length === 0) {
      return this.getNodeName(node);
    }

    return `SWITCH(${this.getNodeName(node)}, ${childExpressions.join(', ')})`;
  }

  private handleForNode(node: WorkflowNode): string {
    if (!node.children || node.children.length === 0) {
      return this.getNodeName(node);
    }

    const childExpressions = node.children
      .map((child) => this.buildExpression(child))
      .filter((expr) => expr !== '');

    if (childExpressions.length === 0) {
      return this.getNodeName(node);
    }

    return `FOR(${this.getNodeName(node)}, ${childExpressions.join(', ')})`;
  }

  private handleParallelBranches(
    parentNode: WorkflowNode,
    children: WorkflowNode[],
  ): string {
    const branches = this.analyzeBranches(children);

    const branchExpressions: string[] = [];
    branches.parallelBranches.forEach((branch) => {
      const branchExpr = this.buildExpression(branch);
      if (branchExpr) {
        branchExpressions.push(branchExpr);
      }
    });

    if (branchExpressions.length === 0) {
      return this.getNodeName(parentNode);
    }

    let whenExpression: string;
    if (branchExpressions.length === 1) {
      whenExpression = branchExpressions[0];
    } else {
      whenExpression = `WHEN(${branchExpressions.join(', ')})`;
    }

    if (branches.afterMergeNodes.length > 0) {
      const mergeNodesExpr = branches.afterMergeNodes
        .map((node) => this.buildExpression(node))
        .filter((expr) => expr !== '')
        .join(', ');

      if (mergeNodesExpr) {
        return `THEN(${this.getNodeName(parentNode)}, ${whenExpression}, ${mergeNodesExpr})`;
      }
    }

    return `THEN(${this.getNodeName(parentNode)}, ${whenExpression})`;
  }

  private analyzeBranches(children: WorkflowNode[]): {
    parallelBranches: WorkflowNode[];
    afterMergeNodes: WorkflowNode[];
  } {
    const parallelBranches: WorkflowNode[] = [];
    const afterMergeNodes: WorkflowNode[] = [];
    const processedSummaryIds = new Set<string>();

    for (const child of children) {
      if (child.type === 'summary') {
        if (!processedSummaryIds.has(child.id)) {
          processedSummaryIds.add(child.id);
          if (child.children && child.children.length > 0) {
            afterMergeNodes.push(...child.children);
          }
        }
      } else {
        const summaryNode = this.findSummaryInBranch(child);
        if (summaryNode) {
          if (!processedSummaryIds.has(summaryNode.id)) {
            processedSummaryIds.add(summaryNode.id);
            const branchBeforeSummary = this.extractBranchBeforeSummary(
              child,
              summaryNode.id,
            );
            if (branchBeforeSummary) {
              parallelBranches.push(branchBeforeSummary);
            }
            if (summaryNode.children && summaryNode.children.length > 0) {
              afterMergeNodes.push(...summaryNode.children);
            }
          }
        } else {
          parallelBranches.push(child);
        }
      }
    }

    return {
      parallelBranches,
      afterMergeNodes: this.deduplicateNodes(afterMergeNodes),
    };
  }

  private findSummaryInBranch(node: WorkflowNode): WorkflowNode | null {
    if (node.type === 'summary') {
      return node;
    }

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const found = this.findSummaryInBranch(child);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  private extractBranchBeforeSummary(
    node: WorkflowNode,
    summaryId: string,
  ): WorkflowNode | null {
    if (node.type === 'summary' && node.id === summaryId) {
      return null;
    }

    if (!node.children || node.children.length === 0) {
      return { ...node };
    }

    const filteredChildren: WorkflowNode[] = [];
    for (const child of node.children) {
      const extracted = this.extractBranchBeforeSummary(child, summaryId);
      if (extracted) {
        filteredChildren.push(extracted);
      }
    }

    return {
      ...node,
      children: filteredChildren.length > 0 ? filteredChildren : undefined,
    };
  }

  private deduplicateNodes(nodes: WorkflowNode[]): WorkflowNode[] {
    const seen = new Set<string>();
    const result: WorkflowNode[] = [];

    for (const node of nodes) {
      if (!seen.has(node.id)) {
        seen.add(node.id);
        result.push(node);
      }
    }

    return result;
  }

  private getNodeName(node: WorkflowNode): string {
    if (this.nodeIdMap.has(node.id)) {
      return this.nodeIdMap.get(node.id)!;
    }

    const componentName = node.name.replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_');
    const uniqueName = `${componentName}_${node.id}`;

    this.nodeIdMap.set(node.id, uniqueName);
    return uniqueName;
  }
}

export function convertToLiteFlow(jsonStr: string | WorkflowNode): string {
  const converter = new LiteFlowConverter();

  let workflow: WorkflowNode;
  if (typeof jsonStr === 'string') {
    try {
      workflow = JSON.parse(jsonStr);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error.message}`, { cause: error });
    }
  } else {
    workflow = jsonStr;
  }

  if (!workflow || typeof workflow !== 'object') {
    throw new Error('Invalid workflow data');
  }

  return converter.convert(workflow);
}

export default LiteFlowConverter;
