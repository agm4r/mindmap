## 1. Dependencies

- [x] 1.1 Install `@tiptap/react` dan `@tiptap/starter-kit` via npm

## 2. Data Model

- [x] 2.1 Update `lib/models/mindmap.ts` — tambah field `notes: { type: String, default: '' }` pada `NodeSchema`
- [x] 2.2 Update interface `MindMapNode` di `lib/models/mindmap.ts` — tambah `notes?: string`

## 3. NoteModal Component

- [x] 3.1 Buat `app/map/[id]/NoteModal.tsx` — full-screen modal dengan `createPortal` ke `document.body`
- [x] 3.2 Tambah header modal: label node sebagai judul + tombol "×" untuk menutup
- [x] 3.3 Inisialisasi Tiptap editor dengan `useEditor` dari `@tiptap/react` dan `StarterKit` dari `@tiptap/starter-kit`
- [x] 3.4 Load konten awal editor dari prop `notes` (HTML string)
- [x] 3.5 Implementasi toolbar formatting sederhana di atas editor: Bold, Italic, H1, H2, Bullet List, Ordered List, Blockquote, Code Block
- [x] 3.6 Saat modal ditutup (tombol × atau Escape), panggil `onClose(editor.getHTML())` untuk mengembalikan konten ke parent

## 4. MindMapEditor — State & Callback

- [x] 4.1 Tambah state `openNoteNodeId: string | null` di `MindMapEditor.tsx`
- [x] 4.2 Buat callback `onOpenNotes(nodeId: string)` — set `openNoteNodeId = nodeId`
- [x] 4.3 Buat callback `onNotesChange(nodeId: string, notes: string)` — update `dbNodes` dan set `isDirty = true`
- [x] 4.4 Render `<NoteModal>` secara kondisional saat `openNoteNodeId !== null`, pass props: `nodeId`, `label`, `notes`, `onClose`
- [x] 4.5 Di `onClose` NoteModal: panggil `onNotesChange` dengan konten terbaru lalu set `openNoteNodeId = null`
- [x] 4.6 Pass `onOpenNotes` ke node data (di samping `onAddChild`, `onDelete`, `onLabelChange`) dalam `useMemo` yang menghitung `layoutedNodes`

## 5. MindMapNode — Tombol & Indikator

- [x] 5.1 Update `MindMapNodeData` type di `MindMapNode.tsx` — tambah `notes?: string` dan `onOpenNotes: (id: string) => void`
- [x] 5.2 Tambah tombol "Notes" di `NodeToolbar` (berlaku untuk semua node termasuk root)
- [x] 5.3 Tambah indikator dot di pojok kanan atas node jika `d.notes` tidak kosong
