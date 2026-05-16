## Why

Saat melakukan research, saya sering meng-copy-paste konten (teks, link, kutipan) ke catatan terpisah. Dengan fitur ini, catatan bisa langsung ditempatkan pada node mind map yang relevan sehingga konteks research tetap terhubung dengan strukturnya.

## What Changes

- Tambah field `notes` (string) pada setiap node di data model
- Tambah tombol "Notes" pada NodeToolbar (di samping "+ Child" dan "Delete")
- Buat komponen `NoteModal.tsx` — full-screen modal dengan Tiptap rich text editor
- Update API `PUT /api/mindmaps/[id]` sudah mendukung perubahan nodes (termasuk field `notes` baru) — tidak perlu endpoint baru
- Notes mengikuti mekanisme manual save yang sudah ada (`isDirty` + tombol Save)

## Capabilities

### New Capabilities

- `node-notes-editor`: Full-screen modal Tiptap editor yang terbuka saat user klik tombol "Notes" pada NodeToolbar sebuah node

### Modified Capabilities

- `mindmap-storage`: Field `notes` ditambahkan ke schema node — requirement data model berubah
- `mindmap-editor`: NodeToolbar mendapat tombol "Notes" baru dan callback `onOpenNotes` — requirement interaksi node berubah

## Impact

- **Dependencies baru**: `@tiptap/react`, `@tiptap/starter-kit`
- **Diubah**: `lib/models/mindmap.ts` — tambah field `notes?: string` pada NodeSchema
- **Diubah**: `app/map/[id]/MindMapNode.tsx` — tambah tombol "Notes" di NodeToolbar
- **Diubah**: `app/map/[id]/MindMapEditor.tsx` — tambah state + callback `onNotesChange`, render NoteModal
- **Baru**: `app/map/[id]/NoteModal.tsx` — Tiptap full-screen modal
