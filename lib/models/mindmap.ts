import mongoose, { Schema, Document } from 'mongoose'

export interface MindMapNode {
  id: string
  label: string
  parentId: string | null
  color: string | null
  notes?: string
}

export interface IMindMap extends Document {
  title: string
  nodes: MindMapNode[]
  createdAt: Date
  updatedAt: Date
}

const NodeSchema = new Schema<MindMapNode>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    parentId: { type: String, default: null },
    color: { type: String, default: null },
    notes: { type: String, default: '' },
  },
  { _id: false }
)

const MindMapSchema = new Schema<IMindMap>(
  {
    title: { type: String, required: true },
    nodes: { type: [NodeSchema], default: [] },
  },
  { timestamps: true }
)

// In development, delete cached model so schema changes take effect on hot-reload
if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).MindMap
}

export const MindMap =
  (mongoose.models.MindMap as mongoose.Model<IMindMap>) ||
  mongoose.model<IMindMap>('MindMap', MindMapSchema)
