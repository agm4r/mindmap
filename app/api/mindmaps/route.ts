import { connectDB } from '@/lib/mongodb'
import { MindMap } from '@/lib/models/mindmap'

export async function GET() {
  await connectDB()
  const mindmaps = await MindMap.find({}, 'title updatedAt').sort({ updatedAt: -1 })
  return Response.json(mindmaps)
}

export async function POST(request: Request) {
  await connectDB()
  const { title } = await request.json()
  const mindmap = await MindMap.create({
    title: title || 'Untitled Mind Map',
    nodes: [{ id: 'root', label: 'Central Idea', parentId: null, color: null }],
  })
  return Response.json(mindmap, { status: 201 })
}
