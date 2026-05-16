import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { MindMap } from '@/lib/models/mindmap'
import MindMapEditor from './MindMapEditor'

export default async function MapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const mindmap = await MindMap.findById(id).lean()
  if (!mindmap) notFound()
  return <MindMapEditor mindmap={JSON.parse(JSON.stringify(mindmap))} />
}
