## Why

Saya membutuhkan alat mind mapping berbasis web untuk brainstorming dan visualisasi ide secara personal. Tidak ada solusi yang ringan, self-hosted, dan terintegrasi penuh dengan workflow development yang saya miliki.

## What Changes

- Tambah halaman dashboard (`/`) untuk mengelola daftar mind map (create, list, delete)
- Tambah halaman editor (`/map/[id]`) dengan canvas mind map berbasis ReactFlow
- Implementasi horizontal tree auto-layout menggunakan dagre
- Implementasi penyimpanan ke MongoDB Atlas via Mongoose
- Tambah API routes untuk CRUD operasi mind map
- Tambah node interactions: add child, edit label inline, delete subtree
- Tambah color-coded branches (auto-assign per level-1 branch)
- Tambah manual save dengan indikator unsaved changes

## Capabilities

### New Capabilities

- `mindmap-dashboard`: Halaman utama untuk list, create, dan delete mind map
- `mindmap-editor`: Canvas editor dengan ReactFlow — add/edit/delete node, auto-layout, koneksi hierarki
- `mindmap-storage`: API routes + Mongoose model untuk persistensi mind map ke MongoDB Atlas

### Modified Capabilities

## Impact

- **Dependencies baru**: `@xyflow/react`, `mongoose`, `dagre`, `@dagrejs/dagre`
- **Pages baru**: `app/page.tsx` (overwrite), `app/map/[id]/page.tsx`
- **API Routes baru**: `app/api/mindmaps/route.ts`, `app/api/mindmaps/[id]/route.ts`
- **Lib baru**: `lib/mongodb.ts`, `lib/models/mindmap.ts`
- **Environment variable**: `MONGODB_URI` (MongoDB Atlas connection string)
