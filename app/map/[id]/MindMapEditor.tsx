'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useRouter } from 'next/navigation'

import MindMapNode from './MindMapNode'
import NoteModal from './NoteModal'
import { getLayoutedElements } from '@/lib/layout'
import { deriveEdges, getDescendants, getNextColor, getAncestorColor } from '@/lib/mindmap-utils'
import type { MindMapNode as DBNode } from '@/lib/models/mindmap'

const nodeTypes = { mindMapNode: MindMapNode }

interface MindMapData {
  _id: string
  title: string
  nodes: DBNode[]
}

export default function MindMapEditor({ mindmap }: { mindmap: MindMapData }) {
  const router = useRouter()
  const [dbNodes, setDbNodes] = useState<DBNode[]>(mindmap.nodes)
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autoFocusId, setAutoFocusId] = useState<string | null>(null)
  const [openNoteNodeId, setOpenNoteNodeId] = useState<string | null>(null)
  const [title, setTitle] = useState(mindmap.title)

  // Stable ref — updated via effect to avoid React 19 render-time ref mutation
  const dbNodesRef = useRef(dbNodes)
  useEffect(() => {
    dbNodesRef.current = dbNodes
  })

  const onAddChild = useCallback((parentId: string) => {
    const prev = dbNodesRef.current
    const newId = crypto.randomUUID()
    const color =
      parentId === 'root'
        ? getNextColor(prev)
        : (getAncestorColor(parentId, prev) ?? getNextColor(prev))
    const newNode: DBNode = { id: newId, label: 'New Node', parentId, color }
    setDbNodes([...prev, newNode])
    setAutoFocusId(newId)
    setIsDirty(true)
  }, [])

  const onDelete = useCallback((nodeId: string) => {
    const prev = dbNodesRef.current
    const toRemove = new Set([nodeId, ...getDescendants(nodeId, prev)])
    setDbNodes(prev.filter((n) => !toRemove.has(n.id)))
    setAutoFocusId(null)
    setIsDirty(true)
  }, [])

  const onLabelChange = useCallback((nodeId: string, label: string) => {
    setDbNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, label } : n)))
    setAutoFocusId(null)
    setIsDirty(true)
  }, [])

  const onAddSibling = useCallback((nodeId: string) => {
    const prev = dbNodesRef.current
    const node = prev.find((n) => n.id === nodeId)
    if (!node || node.parentId === null) return
    const parentId = node.parentId
    const newId = crypto.randomUUID()
    const color =
      parentId === 'root'
        ? getNextColor(prev)
        : (getAncestorColor(parentId, prev) ?? getNextColor(prev))
    const newNode: DBNode = { id: newId, label: 'New Node', parentId, color }
    setDbNodes([...prev, newNode])
    setAutoFocusId(newId)
    setIsDirty(true)
  }, [])

  const onOpenNotes = useCallback((nodeId: string) => {
    setOpenNoteNodeId(nodeId)
  }, [])

  const onNotesChange = useCallback((nodeId: string, notes: string) => {
    setDbNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, notes } : n)))
    setIsDirty(true)
  }, [])

  // Compute layouted nodes + edges whenever dbNodes changes
  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    const flowNodes = dbNodes.map((n) => ({
      id: n.id,
      type: 'mindMapNode' as const,
      position: { x: 0, y: 0 },
      data: {
        label: n.label,
        color: n.color,
        isRoot: n.parentId === null,
        autoFocus: n.id === autoFocusId,
        notes: n.notes,
        onAddChild,
        onAddSibling,
        onDelete,
        onLabelChange,
        onOpenNotes,
      },
    }))
    const flowEdges = deriveEdges(dbNodes)
    const { nodes, edges } = getLayoutedElements(flowNodes, flowEdges)
    return { layoutedNodes: nodes, layoutedEdges: edges }
  }, [dbNodes, autoFocusId, onAddChild, onAddSibling, onDelete, onLabelChange, onOpenNotes])

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

  // Sync layout changes into ReactFlow while preserving selection state
  useEffect(() => {
    setNodes((prev) =>
      layoutedNodes.map((n) => ({
        ...n,
        selected: prev.find((p) => p.id === n.id)?.selected ?? false,
      }))
    )
  }, [layoutedNodes, setNodes])

  useEffect(() => {
    setEdges(layoutedEdges)
  }, [layoutedEdges, setEdges])

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/mindmaps/${mindmap._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes: dbNodes, title }),
    })
    setSaving(false)
    setIsDirty(false)
  }

  function handleBack() {
    if (isDirty) {
      if (confirm('You have unsaved changes. Leave anyway?')) router.push('/')
    } else {
      router.push('/')
    }
  }

  const openNoteNode = openNoteNodeId ? dbNodes.find((n) => n.id === openNoteNodeId) : null

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <button
          onClick={handleBack}
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back
        </button>
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); setIsDirty(true) }}
          className="text-white font-medium flex-1 bg-transparent outline-none min-w-0 truncate hover:text-gray-200 focus:border-b focus:border-gray-600"
        />
        <span className={`text-xs ${isDirty ? 'text-amber-400' : 'text-gray-500'}`}>
          {isDirty ? '● Unsaved' : '✓ Saved'}
        </span>
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm px-4 py-1.5 rounded-lg font-medium transition-colors"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} color="#374151" gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* Mobile FAB — z-9999 ensures it sits above ReactFlow canvas */}
      <button
        onClick={handleSave}
        disabled={!isDirty || saving}
        className={`md:hidden fixed bottom-6 right-6 z-9999 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-xs font-semibold transition-all ${
          isDirty
            ? 'bg-indigo-600 active:bg-indigo-500'
            : 'bg-gray-700 opacity-50'
        }`}
      >
        <span className="flex flex-col items-center leading-tight">
          <span>{saving ? '…' : isDirty ? '●' : '✓'}</span>
          <span style={{ fontSize: 9 }}>Save</span>
        </span>
      </button>

      {/* Notes modal */}
      {openNoteNode && (
        <NoteModal
          label={openNoteNode.label}
          notes={openNoteNode.notes ?? ''}
          onClose={(html) => {
            onNotesChange(openNoteNode.id, html)
            setOpenNoteNodeId(null)
          }}
        />
      )}
    </div>
  )
}
