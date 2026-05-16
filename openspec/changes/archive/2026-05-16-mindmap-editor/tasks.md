## 1. Dependencies & Environment

- [x] 1.1 Install `@xyflow/react`, `@dagrejs/dagre`, `mongoose` via npm
- [x] 1.2 Buat file `.env.local` dengan variable `MONGODB_URI` (MongoDB Atlas connection string)
- [x] 1.3 Baca panduan Next.js di `node_modules/next/dist/docs/` untuk memastikan App Router API routes syntax yang benar

## 2. MongoDB Storage Layer

- [x] 2.1 Buat `lib/mongodb.ts` — singleton Mongoose connection dengan connection pooling
- [x] 2.2 Buat `lib/models/mindmap.ts` — Mongoose schema & model dengan fields: `title`, `nodes[]` (id, label, parentId, color), timestamps
- [x] 2.3 Buat `app/api/mindmaps/route.ts` — GET (list, select title+updatedAt only) dan POST (buat baru dengan root node)
- [x] 2.4 Buat `app/api/mindmaps/[id]/route.ts` — GET (by id), PUT (update title+nodes), DELETE

## 3. Dashboard Page

- [x] 3.1 Buat `app/page.tsx` — fetch list mind map dari API, render grid cards
- [x] 3.2 Tambah tombol "+ New Mind Map" yang POST ke API lalu redirect ke `/map/[id]`
- [x] 3.3 Tambah tombol "Open" pada setiap card yang navigasi ke `/map/[id]`
- [x] 3.4 Tambah tombol hapus pada setiap card dengan dialog konfirmasi dan DELETE ke API
- [x] 3.5 Tampilkan empty state jika daftar kosong

## 4. Layout Engine

- [x] 4.1 Buat `lib/layout.ts` — fungsi `getLayoutedElements(nodes, edges)` menggunakan dagre dengan `rankdir: "LR"` (left to right), node size estimasi tetap
- [x] 4.2 Buat `lib/mindmap-utils.ts` — fungsi helper:
  - `getDescendants(nodeId, nodes)` → semua id descendant (untuk delete subtree)
  - `getNextColor(nodes)` → warna berikutnya dari palette berdasarkan jumlah branch level-1
  - `deriveEdges(nodes)` → buat edge array dari parentId relationships
  - `getAncestorColor(nodeId, nodes)` → warna dari ancestor level-1

## 5. Mind Map Editor — Canvas

- [x] 5.1 Buat `app/map/[id]/page.tsx` — fetch mind map by id, render komponen editor
- [x] 5.2 Buat `app/map/[id]/MindMapEditor.tsx` — client component dengan ReactFlow canvas
- [x] 5.3 Inisialisasi ReactFlow dengan nodes dan edges dari hasil `getLayoutedElements()` + `deriveEdges()`
- [x] 5.4 Aktifkan fitur zoom, pan; nonaktifkan drag node (posisi dikontrol dagre)

## 6. Mind Map Editor — Node Interactions

- [x] 6.1 Buat custom node component `app/map/[id]/MindMapNode.tsx` — tampilkan label, floating action bar saat node diklik (tombol "+ Child" dan "🗑️ Delete", tanpa Delete untuk root), warna background dari data node
- [x] 6.2 Implementasi add child: assign id baru (`crypto.randomUUID()`), set parentId, hitung warna, tambah ke state, jalankan re-layout
- [x] 6.3 Implementasi delete subtree: kumpulkan semua descendant dengan `getDescendants()`, filter dari state nodes, jalankan re-layout
- [x] 6.4 Implementasi inline edit: double-click → tampilkan input field di node; Enter/blur → simpan label ke state

## 7. Mind Map Editor — Save & Navigation

- [x] 7.1 Tambah state `isDirty` yang di-set `true` setiap ada perubahan node/label
- [x] 7.2 Tambah toolbar di atas canvas: tombol "← Back", judul mind map, indikator "● Unsaved" / "✓ Saved", tombol "Save"
- [x] 7.3 Implementasi save: PUT ke `/api/mindmaps/[id]` dengan nodes terkini, reset `isDirty` ke false
- [x] 7.4 Implementasi back navigation: jika `isDirty`, tampilkan konfirmasi sebelum navigasi ke `/`
