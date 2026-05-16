'use client'

import { useRef, useState } from 'react'
import { Handle, NodeToolbar, Position, type NodeProps } from '@xyflow/react'

export type MindMapNodeData = {
  label: string
  color: string | null
  isRoot: boolean
  autoFocus: boolean
  notes?: string
  onAddChild: (id: string) => void
  onAddSibling: (id: string) => void
  onDelete: (id: string) => void
  onLabelChange: (id: string, label: string) => void
  onOpenNotes: (id: string) => void
}

const hasNotes = (notes?: string) => !!(notes && notes !== '<p></p>')

export default function MindMapNode({ id, data, selected }: NodeProps) {
  const d = data as unknown as MindMapNodeData
  const [editing, setEditing] = useState(() => d.autoFocus)
  const [editValue, setEditValue] = useState(d.label)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEditing() {
    setEditValue(d.label)
    setEditing(true)
    // Select all after input mounts (requestAnimationFrame = after paint)
    requestAnimationFrame(() => {
      const el = inputRef.current
      if (el) el.setSelectionRange(0, el.value.length)
    })
  }

  function commit() {
    const trimmed = editValue.trim() || 'Node'
    d.onLabelChange(id, trimmed)
    setEditing(false)
  }

  const bg = d.isRoot ? '#4f46e5' : (d.color ?? '#6b7280')

  return (
    <div
      className="relative"
      onDoubleClick={(e) => {
        e.stopPropagation()
        startEditing()
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />

      <div
        style={{ backgroundColor: bg }}
        className="relative px-4 py-2 rounded-lg text-white text-sm font-medium shadow-md min-w-25 max-w-45"
      >
        {/* autoFocus triggers mobile keyboard on mount — both for new nodes and Rename */}
        {editing ? (
          <input
            autoFocus
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') setEditing(false)
            }}
            className="bg-transparent outline-none w-full text-white placeholder-white/60 min-w-0"
          />
        ) : (
          <span className="truncate block select-none">{d.label}</span>
        )}

        {hasNotes(d.notes) && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-gray-950"
            title="Has notes"
          />
        )}
      </div>

      <NodeToolbar isVisible={selected && !editing} position={Position.Top}>
        <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 shadow-xl">
          <button
            onClick={() => d.onAddChild(id)}
            className="text-xs text-white hover:text-indigo-300 px-1.5 py-0.5 rounded transition-colors"
          >
            + Child
          </button>
          {!d.isRoot && (
            <>
              <span className="text-gray-600 text-xs">|</span>
              <button
                onClick={() => d.onAddSibling(id)}
                className="text-xs text-white hover:text-indigo-300 px-1.5 py-0.5 rounded transition-colors"
              >
                + Sibling
              </button>
            </>
          )}
          <span className="text-gray-600 text-xs">|</span>
          <button
            onClick={startEditing}
            className="text-xs text-gray-300 hover:text-white px-1.5 py-0.5 rounded transition-colors"
          >
            Rename
          </button>
          <span className="text-gray-600 text-xs">|</span>
          <button
            onClick={() => d.onOpenNotes(id)}
            className="text-xs text-gray-300 hover:text-amber-300 px-1.5 py-0.5 rounded transition-colors"
          >
            Notes
          </button>
          {!d.isRoot && (
            <>
              <span className="text-gray-600 text-xs">|</span>
              <button
                onClick={() => d.onDelete(id)}
                className="text-xs text-gray-400 hover:text-red-400 px-1.5 py-0.5 rounded transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </NodeToolbar>

      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />
    </div>
  )
}
