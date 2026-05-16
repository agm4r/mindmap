import type { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { MindMap } from '@/lib/models/mindmap'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  await connectDB()
  const { id } = await params
  const mindmap = await MindMap.findById(id)
  if (!mindmap) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(mindmap)
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  await connectDB()
  const { id } = await params
  const body = await request.json()
  const update: Record<string, unknown> = {}
  if (body.title !== undefined) update.title = body.title
  if (body.nodes !== undefined) update.nodes = body.nodes
  const mindmap = await MindMap.findByIdAndUpdate(id, update, { new: true })
  if (!mindmap) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(mindmap)
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  await connectDB()
  const { id } = await params
  const mindmap = await MindMap.findByIdAndDelete(id)
  if (!mindmap) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ success: true })
}
