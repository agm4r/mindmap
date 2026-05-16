## Context

Proyek adalah Next.js 16 App Router yang masih kosong (hanya boilerplate). Tidak ada autentikasi, tidak ada database yang terhubung, dan tidak ada komponen yang dibuat. Target adalah aplikasi mind mapping personal — satu pengguna, tidak ada kolaborasi real-time.

## Goals / Non-Goals

**Goals:**
- Aplikasi mind map yang berfungsi penuh dengan canvas ReactFlow
- Hierarki node (satu root → branch → sub-branch) dengan horizontal tree layout
- Auto-layout otomatis menggunakan dagre setiap kali node ditambah/dihapus
- Persistensi ke MongoDB Atlas dengan manual save
- Dashboard untuk mengelola multiple mind map

**Non-Goals:**
- Autentikasi / multi-user
- Real-time collaboration
- Export (PNG, PDF)
- Undo/redo
- Free-drag node positions (semua posisi dikontrol dagre)
- Custom shapes selain node teks

## Decisions

### 1. ReactFlow dengan @xyflow/react

**Pilihan**: `@xyflow/react` (v12+, package baru dari XYFlow team)
**Alasan**: API terbaru, aktif dikembangkan, React 19 compatible. Menyediakan canvas, zoom/pan, node rendering, dan edge rendering siap pakai.
**Alternatif ditolak**: `reactflow` (v11) — package lama, tidak diupdate untuk React 19.

### 2. Auto-layout dengan dagre

**Pilihan**: `@dagrejs/dagre` untuk menghitung posisi node secara otomatis
**Alasan**: Dagre adalah library directed graph layout yang mature, ringan, dan mudah diintegrasikan dengan ReactFlow. Mendukung layout horizontal tree (rankdir: LR).
**Cara kerja**: Setiap kali struktur node berubah (tambah/hapus), `getLayoutedElements()` dipanggil ulang — dagre menghitung ulang semua posisi, lalu ReactFlow di-update via `setNodes`.
**Alternatif ditolak**: `elkjs` — lebih powerful tapi lebih berat dan setup lebih kompleks; `d3-hierarchy` — butuh lebih banyak kode manual.

### 3. Data model: node list flat + parentId (bukan nested tree)

**Pilihan**: Simpan nodes sebagai array flat dengan field `parentId`
```
nodes: [
  { id: "root", label: "Central Idea", parentId: null, color: null },
  { id: "n1",   label: "Branch A",     parentId: "root", color: "#ef4444" },
  { id: "n2",   label: "Sub A1",       parentId: "n1",  color: "#ef4444" },
]
```
**Alasan**: Flat list lebih mudah di-update (tidak perlu rekursi), mudah di-query di MongoDB, dan mudah dikonsumsi oleh ReactFlow (yang juga butuh flat array). Edge diderivasi dari parentId saat render — tidak disimpan terpisah.
**Alternatif ditolak**: Nested tree — sulit di-update node di tengah hierarki; separate edges collection — redundant karena edges bisa diderivasi.

### 4. Warna branch: auto-assign dari palette, diinherit dari level-1

**Pilihan**: Saat node level-1 dibuat, assign warna berikutnya dari palette 6 warna. Child nodes inherit warna dari ancestor level-1.
```
PALETTE = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#f97316"]
```
**Alasan**: Warna konsisten per branch membuat hierarki mudah dibaca. Auto-assign menghilangkan keputusan warna dari user untuk v1.

### 5. MongoDB: embedded document (nodes array dalam satu dokumen mindmap)

**Pilihan**: Satu dokumen MongoDB = satu mind map lengkap dengan semua nodes
**Alasan**: Personal app, tidak ada concurrent writes, ukuran mind map reasonable (ratusan node). Embedded document lebih simple — satu read/write per operasi.
**Alternatif ditolak**: Separate nodes collection — over-engineering untuk use case ini.

### 6. Save strategy: manual save + unsaved indicator

**Pilihan**: Tombol "Save" di toolbar, dengan indikator visual `● Unsaved` ketika ada perubahan belum disimpan
**Alasan**: User meminta manual save. Hindari banyak writes ke MongoDB untuk setiap keystroke.
**Implementation**: State `isDirty: boolean` di-set `true` setiap kali ada perubahan node. Reset ke `false` setelah save berhasil.

### 7. Node interaction UX

- **Klik node** → tampil floating action bar dengan tombol [+ Child] dan [🗑️ Delete]
- **Double-click node** → aktifkan inline editing langsung di node (input field)
- **Hapus node** → hapus node beserta seluruh subtree-nya (rekursif)
- **Root node** → tidak bisa dihapus, tidak bisa diedit parentId-nya

## Risks / Trade-offs

- **Dagre re-layout setiap perubahan** → Untuk mind map dengan ratusan node, ini bisa terasa janky. Mitigasi: layout hanya dipanggil saat struktur berubah (bukan saat edit label), dan animasi transisi dimatikan untuk performa.
- **MongoDB Atlas cold start** → Connection pertama bisa lambat. Mitigasi: connection pooling dengan singleton pattern di `lib/mongodb.ts`.
- **Node ID collision** → Menggunakan `crypto.randomUUID()` untuk generate ID, probabilitas collision sangat rendah.
- **Flat list + delete subtree** → Harus rekursif collect semua descendant sebelum delete. Mitigasi: helper function `getDescendants(nodeId, nodes)` yang jelas dan teruji.

## Migration Plan

Tidak ada migrasi — aplikasi baru dari nol. Deployment: user cukup set `MONGODB_URI` di `.env.local` dan jalankan `npm run dev`.

## Open Questions

- Tidak ada — semua keputusan sudah difinalisasi dalam sesi eksplorasi.
