'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface MindMapSummary {
  _id: string
  title: string
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [mindmaps, setMindmaps] = useState<MindMapSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/mindmaps')
      .then((r) => r.json())
      .then((data) => {
        setMindmaps(data)
        setLoading(false)
      })
  }, [])

  async function handleCreate() {
    setCreating(true)
    const res = await fetch('/api/mindmaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Mind Map' }),
    })
    const data = await res.json()
    router.push(`/map/${data._id}`)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/mindmaps/${id}`, { method: 'DELETE' })
    setMindmaps((prev) => prev.filter((m) => m._id !== id))
    setDeleteTarget(null)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Mind Maps</h1>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {creating ? 'Creating...' : '+ New Mind Map'}
          </button>
        </div>

        {loading ? (
          <div className="text-gray-500 text-center py-20">Loading...</div>
        ) : mindmaps.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <p className="text-gray-400 text-lg">No mind maps yet.</p>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create your first mind map
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mindmaps.map((m) => (
              <div
                key={m._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <h2 className="font-semibold text-white truncate">{m.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(m.updatedAt)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/map/${m._id}`)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setDeleteTarget(m._id)}
                    className="px-3 py-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-white mb-2">Delete mind map?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
