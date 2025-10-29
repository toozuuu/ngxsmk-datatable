import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  TreeTableConfig,
  TreeNode,
  TreeState,
  FlattenedTreeNode
} from '../interfaces/tree-table.interface';

/**
 * Service for managing tree table operations
 */
@Injectable({
  providedIn: 'root'
})
export class TreeTableService {
  private treeState$ = new BehaviorSubject<TreeState>({
    expandedNodes: new Set(),
    collapsedNodes: new Set(),
    loadingNodes: new Set()
  });

  /**
   * Get current tree state
   */
  get state$(): Observable<TreeState> {
    return this.treeState$.asObservable();
  }

  /**
   * Get state snapshot
   */
  getState(): TreeState {
    return this.treeState$.value;
  }

  /**
   * Flatten tree structure for rendering
   */
  flattenTree<T = any>(
    nodes: TreeNode<T>[],
    config: Partial<TreeTableConfig> = {}
  ): FlattenedTreeNode<T>[] {
    const result: FlattenedTreeNode<T>[] = [];
    this.flattenRecursive(nodes, result, 0, null, config);
    return result;
  }

  /**
   * Recursively flatten tree nodes
   */
  private flattenRecursive<T>(
    nodes: TreeNode<T>[],
    result: FlattenedTreeNode<T>[],
    level: number,
    parent: string | null,
    config: Partial<TreeTableConfig>
  ): void {
    if (!nodes) return;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeId = this.getNodeId(node, i, parent);
      const hasChildren = this.hasChildren(node);
      const isExpanded = this.isNodeExpanded(nodeId);
      const isLoading = this.isNodeLoading(nodeId);

      const flatNode: FlattenedTreeNode<T> = {
        data: node.data,
        id: nodeId,
        level,
        hasChildren,
        isExpanded,
        isLoading,
        parent,
        isLeaf: !hasChildren,
        childCount: hasChildren ? (node.children?.length || 0) : 0
      };

      result.push(flatNode);

      // Add children if expanded and available
      if (hasChildren && isExpanded && node.children) {
        this.flattenRecursive(
          node.children,
          result,
          level + 1,
          nodeId,
          config
        );
      }
    }
  }

  /**
   * Generate unique node ID
   */
  private getNodeId<T>(
    node: TreeNode<T>,
    index: number,
    parent: string | null
  ): string {
    if (node.id) {
      return node.id;
    }
    return parent ? `${parent}-${index}` : `node-${index}`;
  }

  /**
   * Check if node has children
   */
  hasChildren<T>(node: TreeNode<T>): boolean {
    if (node.hasChildren !== undefined) {
      return node.hasChildren;
    }
    return !!(node.children && node.children.length > 0);
  }

  /**
   * Toggle node expansion
   */
  toggleNode(nodeId: string): void {
    const state = this.getState();
    const expanded = new Set(state.expandedNodes);
    const collapsed = new Set(state.collapsedNodes);

    if (expanded.has(nodeId)) {
      expanded.delete(nodeId);
      collapsed.add(nodeId);
    } else {
      expanded.add(nodeId);
      collapsed.delete(nodeId);
    }

    this.treeState$.next({
      ...state,
      expandedNodes: expanded,
      collapsedNodes: collapsed
    });
  }

  /**
   * Expand a node
   */
  expandNode(nodeId: string): void {
    const state = this.getState();
    const expanded = new Set(state.expandedNodes);
    const collapsed = new Set(state.collapsedNodes);

    expanded.add(nodeId);
    collapsed.delete(nodeId);

    this.treeState$.next({
      ...state,
      expandedNodes: expanded,
      collapsedNodes: collapsed
    });
  }

  /**
   * Collapse a node
   */
  collapseNode(nodeId: string): void {
    const state = this.getState();
    const expanded = new Set(state.expandedNodes);
    const collapsed = new Set(state.collapsedNodes);

    expanded.delete(nodeId);
    collapsed.add(nodeId);

    this.treeState$.next({
      ...state,
      expandedNodes: expanded,
      collapsedNodes: collapsed
    });
  }

  /**
   * Expand all nodes
   */
  expandAll<T>(nodes: TreeNode<T>[]): void {
    const allIds = this.getAllNodeIds(nodes);
    const state = this.getState();

    this.treeState$.next({
      ...state,
      expandedNodes: new Set(allIds),
      collapsedNodes: new Set()
    });
  }

  /**
   * Collapse all nodes
   */
  collapseAll(): void {
    const state = this.getState();

    this.treeState$.next({
      ...state,
      expandedNodes: new Set(),
      collapsedNodes: new Set(state.expandedNodes)
    });
  }

  /**
   * Expand to a specific level
   */
  expandToLevel<T>(nodes: TreeNode<T>[], targetLevel: number): void {
    const idsToExpand: string[] = [];
    this.collectIdsToLevel(nodes, 0, targetLevel, null, idsToExpand);

    const state = this.getState();
    this.treeState$.next({
      ...state,
      expandedNodes: new Set(idsToExpand),
      collapsedNodes: new Set()
    });
  }

  /**
   * Collect node IDs up to a specific level
   */
  private collectIdsToLevel<T>(
    nodes: TreeNode<T>[],
    currentLevel: number,
    targetLevel: number,
    parent: string | null,
    result: string[]
  ): void {
    if (!nodes || currentLevel > targetLevel) return;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeId = this.getNodeId(node, i, parent);

      if (currentLevel < targetLevel && this.hasChildren(node)) {
        result.push(nodeId);

        if (node.children) {
          this.collectIdsToLevel(
            node.children,
            currentLevel + 1,
            targetLevel,
            nodeId,
            result
          );
        }
      }
    }
  }

  /**
   * Get all node IDs from tree
   */
  private getAllNodeIds<T>(
    nodes: TreeNode<T>[],
    parent: string | null = null
  ): string[] {
    const ids: string[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeId = this.getNodeId(node, i, parent);
      
      if (this.hasChildren(node)) {
        ids.push(nodeId);
        
        if (node.children) {
          ids.push(...this.getAllNodeIds(node.children, nodeId));
        }
      }
    }
    
    return ids;
  }

  /**
   * Check if node is expanded
   */
  isNodeExpanded(nodeId: string): boolean {
    const state = this.getState();
    
    // Default to collapsed if not explicitly expanded
    return state.expandedNodes.has(nodeId);
  }

  /**
   * Check if node is loading
   */
  isNodeLoading(nodeId: string): boolean {
    const state = this.getState();
    return state.loadingNodes.has(nodeId);
  }

  /**
   * Set node loading state
   */
  setNodeLoading(nodeId: string, loading: boolean): void {
    const state = this.getState();
    const loadingNodes = new Set(state.loadingNodes);

    if (loading) {
      loadingNodes.add(nodeId);
    } else {
      loadingNodes.delete(nodeId);
    }

    this.treeState$.next({
      ...state,
      loadingNodes
    });
  }

  /**
   * Find node by ID in tree
   */
  findNode<T>(
    nodes: TreeNode<T>[],
    targetId: string,
    parent: string | null = null
  ): TreeNode<T> | null {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeId = this.getNodeId(node, i, parent);

      if (nodeId === targetId) {
        return node;
      }

      if (node.children) {
        const found = this.findNode(node.children, targetId, nodeId);
        if (found) return found;
      }
    }

    return null;
  }

  /**
   * Get node path (breadcrumb)
   */
  getNodePath<T>(
    nodes: TreeNode<T>[],
    targetId: string,
    parent: string | null = null
  ): TreeNode<T>[] {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeId = this.getNodeId(node, i, parent);

      if (nodeId === targetId) {
        return [node];
      }

      if (node.children) {
        const path = this.getNodePath(node.children, targetId, nodeId);
        if (path.length > 0) {
          return [node, ...path];
        }
      }
    }

    return [];
  }

  /**
   * Get node level
   */
  getNodeLevel<T>(
    nodes: TreeNode<T>[],
    targetId: string,
    currentLevel: number = 0,
    parent: string | null = null
  ): number {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeId = this.getNodeId(node, i, parent);

      if (nodeId === targetId) {
        return currentLevel;
      }

      if (node.children) {
        const level = this.getNodeLevel(node.children, targetId, currentLevel + 1, nodeId);
        if (level !== -1) return level;
      }
    }

    return -1;
  }

  /**
   * Convert flat data to tree structure
   */
  buildTreeFromFlat<T extends { id: any; parentId?: any }>(
    flatData: T[],
    idField: string = 'id',
    parentIdField: string = 'parentId'
  ): TreeNode<T>[] {
    const map = new Map<any, TreeNode<T>>();
    const roots: TreeNode<T>[] = [];

    // First pass: create tree nodes
    for (const item of flatData) {
      const node: TreeNode<T> = {
        id: String(item[idField as keyof T]),
        data: item,
        children: []
      };
      map.set(item[idField as keyof T], node);
    }

    // Second pass: build hierarchy
    for (const item of flatData) {
      const node = map.get(item[idField as keyof T])!;
      const parentId = item[parentIdField as keyof T];

      if (parentId == null) {
        roots.push(node);
      } else {
        const parent = map.get(parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        } else {
          // Parent not found, treat as root
          roots.push(node);
        }
      }
    }

    return roots;
  }

  /**
   * Clear all state
   */
  clearState(): void {
    this.treeState$.next({
      expandedNodes: new Set(),
      collapsedNodes: new Set(),
      loadingNodes: new Set()
    });
  }

  /**
   * Get tree statistics
   */
  getTreeStats<T>(nodes: TreeNode<T>[]): {
    totalNodes: number;
    maxDepth: number;
    leafNodes: number;
    branchNodes: number;
  } {
    let totalNodes = 0;
    let leafNodes = 0;
    let branchNodes = 0;
    let maxDepth = 0;

    const traverse = (nodes: TreeNode<T>[], depth: number) => {
      for (const node of nodes) {
        totalNodes++;
        maxDepth = Math.max(maxDepth, depth);

        if (this.hasChildren(node)) {
          branchNodes++;
          if (node.children) {
            traverse(node.children, depth + 1);
          }
        } else {
          leafNodes++;
        }
      }
    };

    traverse(nodes, 0);

    return { totalNodes, maxDepth, leafNodes, branchNodes };
  }
}

