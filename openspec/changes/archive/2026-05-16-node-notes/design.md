## Context

Aplikasi mind map sudah memiliki sistem node dengan label, warna, dan hierarki. NodeToolbar sudah terpasang dengan tombol "+ Child" dan "Delete". Data disimpan di MongoDB Atlas sebagai embedded nodes array dalam satu dokumen mindmap. Save dilakukan secara manual via tombol di toolbar editor.

## Goals / Non-Goals

**Goals:**
- Setiap node dapat menyimpan catatan rich text (bold, italic, heading, list, code block, link)
- Catatan dibuka via tombol "Notes" di NodeToolbar → full-screen modal
- Catatan tersimpan ke state lokal (isDirty) saat diedit, lalu ke MongoDB saat user klik Save
- Indikator visual pada node jika ia memiliki catatan (agar user tahu node mana yang ada isinya)

**Non-Goals:**
- Auto-save catatan
- Export catatan per node (PDF, Markdown file)
- Pencarian dalam catatan
- Attachment (gambar, file)
- Versi/history catatan

## Decisions

### 1. Rich Text Editor: Tiptap

**Pilihan**: `@tiptap/react` + `@tiptap/starter-kit`
**Alasan**: Tiptap adalah editor headless yang modern, React-friendly, dan extensible. `starter-kit` sudah mencakup semua ekstensi umum (bold, italic, heading, list, blockquote, code, link, dll) dalam satu package. Tidak membutuhkan CSS framework khusus — styling sepenuhnya dikontrol Tailwind.
**Alternatif ditolak**: `react-quill` — tidak aktif diupdate, tidak support React 19; `@uiw/react-md-editor` — Markdown saja (user memilih WYSIWYG); `slate` — terlalu low-level, butuh banyak kode tambahan.

### 2. Modal: Full-screen overlay (bukan side panel atau route baru)

**Pilihan**: `fixed inset-0` div yang di-render di dalam `MindMapEditor`
**Alasan**: Sesuai pilihan user. Modal overlay lebih sederhana dari route baru (tidak perlu routing), dan tidak memotong canvas (berbeda dengan side panel).
**Detail implementasi**: Modal di-render sebagai portal React (`createPortal`) ke `document.body` agar tidak terpengaruh z-index stacking context dari ReactFlow canvas.

### 3. State management: `openNoteNodeId` di MindMapEditor

**Pilihan**: State `openNoteNodeId: string | null` di `MindMapEditor`. Saat ada nilai, modal ditampilkan untuk node tersebut.
**Alasan**: MindMapEditor sudah menjadi pusat state (dbNodes, isDirty, saving). Menambahkan satu state di sana untuk modal tetap sederhana dan tidak membutuhkan state management tambahan.
**Cara kerja**: `onOpenNotes(nodeId)` → set `openNoteNodeId = nodeId` → NoteModal render. User tutup modal → set `openNoteNodeId = null`.

### 4. Data model: tambah `notes?: string` di node

**Pilihan**: Field `notes` opsional (string HTML dari Tiptap) langsung di dalam node object.
```
{ id, label, parentId, color, notes?: string }
```
**Alasan**: Konsisten dengan pendekatan embedded document yang ada. Notes disimpan sebagai HTML string karena Tiptap menggunakan HTML sebagai format internal — tidak perlu parsing tambahan saat load.
**Alternatif ditolak**: Field JSON untuk Tiptap's internal prosemirror format — lebih verbose, tidak perlu untuk kebutuhan ini.

### 5. Callback: `onNotesChange(nodeId, notes)` — sama dengan `onLabelChange`

**Pilihan**: Callback yang di-pass melalui `data` node (sama seperti `onAddChild`, `onDelete`, `onLabelChange` yang sudah ada).
**Alasan**: Konsisten dengan pola yang ada di `MindMapNode`. Callback di-define di `MindMapEditor` dengan `useCallback`, diakses via `dbNodesRef` untuk menghindari stale closure.

### 6. Indikator node memiliki catatan

**Pilihan**: Tampilkan dot kecil (●) di pojok kanan atas node jika `notes` tidak kosong.
**Alasan**: Memberikan visual feedback tanpa mengubah ukuran node yang sudah dikalibrasi dagre.

## Risks / Trade-offs

- **HTML string di MongoDB** → Ukuran dokumen bisa besar jika catatan sangat panjang. Mitigasi: MongoDB document limit 16MB jauh dari jangkauan untuk personal use.
- **Tiptap HTML parsing** → Jika ada XSS concern, HTML dari Tiptap perlu di-sanitize sebelum dirender. Mitigasi: konten hanya dirender untuk diri sendiri (personal app), XSS bukan ancaman nyata di sini.
- **Modal tidak auto-save** → User bisa kehilangan catatan jika menutup browser tanpa Save. Mitigasi: indikator `● Unsaved` di toolbar sudah memberikan signal; ini adalah keputusan sadar user.

## Migration Plan

Tidak ada migrasi data — field `notes` bersifat opsional. Node yang sudah ada tidak terpengaruh; saat disimpan ulang, field `notes` akan muncul hanya jika user pernah membuka modal dan mengedit.

## Open Questions

Tidak ada.
