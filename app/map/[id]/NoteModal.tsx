'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  label: string
  notes: string
  onClose: (html: string) => void
}

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
        active
          ? 'bg-indigo-600 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

export default function NoteModal({ label, notes, onClose }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: notes || '',
    editorProps: {
      attributes: {
        class: 'ProseMirror min-h-full focus:outline-none',
      },
    },
  })

  function handleClose() {
    onClose(editor?.getHTML() ?? '')
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
        <h2 className="text-white font-semibold text-lg truncate">{label}</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white text-2xl leading-none ml-4 transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Formatting toolbar */}
      <div className="flex items-center gap-0.5 px-4 py-2 border-b border-gray-800 shrink-0 flex-wrap">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive('bold')}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive('italic')}
        >
          <em>I</em>
        </ToolbarButton>
        <span className="w-px h-4 bg-gray-700 mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor?.isActive('heading', { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive('heading', { level: 2 })}
        >
          H2
        </ToolbarButton>
        <span className="w-px h-4 bg-gray-700 mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive('bulletList')}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive('orderedList')}
        >
          1. List
        </ToolbarButton>
        <span className="w-px h-4 bg-gray-700 mx-1" />
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive('blockquote')}
        >
          ❝ Quote
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          active={editor?.isActive('codeBlock')}
        >
          {'</>'}
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCode().run()}
          active={editor?.isActive('code')}
        >
          `code`
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>,
    document.body
  )
}
