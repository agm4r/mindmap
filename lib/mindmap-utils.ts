import type { Edge } from '@xyflow/react'
import type { MindMapNode } from './models/mindmap'

const PALETTE = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#f97316']

export function getDescendants(nodeId: string, nodes: MindMapNode[]): string[] {
  const children = nodes.filter((n) => n.parentId === nodeId).map((n) => n.id)
  return children.flatMap((childId) => [childId, ...getDescendants(childId, nodes)])
}

export function getAncestorColor(nodeId: string, nodes: MindMapNode[]): string | null {
  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return null
  if (node.parentId === null) return null
  if (node.parentId === 'root') return node.color
  return getAncestorColor(node.parentId, nodes)
}

export function getNextColor(nodes: MindMapNode[]): string {
  const level1Count = nodes.filter((n) => n.parentId === 'root').length
  return PALETTE[level1Count % PALETTE.length]
}

export function deriveEdges(nodes: MindMapNode[]): Edge[] {
  return nodes
    .filter((n) => n.parentId !== null)
    .map((n) => ({
      id: `e-${n.parentId}-${n.id}`,
      source: n.parentId!,
      target: n.id,
      type: 'smoothstep',
      style: { stroke: n.color ?? '#6b7280', strokeWidth: 2 },
    }))
}
