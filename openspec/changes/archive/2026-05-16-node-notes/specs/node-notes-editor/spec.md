## ADDED Requirements

### Requirement: Buka modal catatan dari NodeToolbar
Sistem SHALL menampilkan tombol "Notes" pada NodeToolbar setiap node, dan membuka full-screen modal editor saat tombol diklik.

#### Scenario: Klik tombol Notes
- **WHEN** pengguna mengklik tombol "Notes" pada NodeToolbar sebuah node
- **THEN** full-screen modal terbuka dengan label node sebagai judul dan konten catatan node tersebut di dalam editor

#### Scenario: Modal kosong untuk node baru
- **WHEN** node belum memiliki catatan (field `notes` kosong atau undefined)
- **THEN** editor terbuka dalam keadaan kosong, siap menerima input

---

### Requirement: Edit catatan dengan Tiptap rich text editor
Sistem SHALL menyediakan Tiptap rich text editor di dalam modal yang mendukung formatting dasar.

#### Scenario: Formatting tersedia
- **WHEN** pengguna berada di dalam modal editor
- **THEN** pengguna dapat menggunakan bold, italic, heading (H1-H3), bullet list, ordered list, blockquote, dan code block

#### Scenario: Paste teks bebas
- **WHEN** pengguna paste teks dari clipboard (browser, PDF, dokumen)
- **THEN** teks muncul di editor dan dapat diedit

---

### Requirement: Tutup modal dan simpan ke state
Sistem SHALL menyimpan konten catatan ke state lokal saat modal ditutup.

#### Scenario: Tutup dengan tombol X
- **WHEN** pengguna mengklik tombol "×" di pojok kanan atas modal
- **THEN** modal tertutup, konten catatan tersimpan ke state node, dan indikator `● Unsaved` muncul di toolbar (jika ada perubahan)

#### Scenario: Tutup dengan Escape
- **WHEN** pengguna menekan tombol Escape saat modal terbuka
- **THEN** modal tertutup dengan perilaku yang sama seperti klik tombol "×"

---

### Requirement: Indikator node memiliki catatan
Sistem SHALL menampilkan tanda visual pada node yang memiliki catatan tidak kosong.

#### Scenario: Node dengan catatan
- **WHEN** sebuah node memiliki field `notes` yang tidak kosong
- **THEN** node menampilkan indikator kecil (dot) di pojok kanan atas node pada canvas

#### Scenario: Node tanpa catatan
- **WHEN** sebuah node tidak memiliki `notes` atau `notes` kosong
- **THEN** tidak ada indikator tambahan pada node
