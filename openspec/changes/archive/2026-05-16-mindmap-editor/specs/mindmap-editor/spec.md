## ADDED Requirements

### Requirement: Tampilkan canvas mind map
Sistem SHALL merender mind map dalam canvas ReactFlow dengan layout horizontal tree (kiri ke kanan) menggunakan dagre, dengan root node di sisi kiri.

#### Scenario: Load mind map yang ada
- **WHEN** pengguna membuka `/map/[id]`
- **THEN** sistem mengambil data dari API, menghitung posisi dengan dagre, dan merender semua node dan edge pada canvas

#### Scenario: Canvas kosong jika hanya root
- **WHEN** mind map hanya memiliki root node
- **THEN** root node ditampilkan di tengah-kiri canvas tanpa edge

---

### Requirement: Tambah child node
Sistem SHALL memungkinkan pengguna menambah child node dari node mana pun.

#### Scenario: Tambah child dari node yang dipilih
- **WHEN** pengguna mengklik sebuah node lalu mengklik tombol "+ Child"
- **THEN** sistem menambah child node baru dengan label "New Node", mewarisi warna branch dari ancestor level-1, layout dikalkulasi ulang, dan node baru langsung masuk mode edit

#### Scenario: Warna branch diinherit
- **WHEN** child node ditambah di bawah branch level-1 berwarna merah
- **THEN** child node tersebut dan seluruh keturunannya menggunakan warna merah yang sama

---

### Requirement: Edit label node inline
Sistem SHALL memungkinkan pengguna mengedit label node langsung pada canvas.

#### Scenario: Aktifkan edit dengan double-click
- **WHEN** pengguna double-click pada sebuah node
- **THEN** node berubah menjadi input field yang dapat diedit dengan teks terpilih semua

#### Scenario: Simpan edit dengan Enter atau blur
- **WHEN** pengguna menekan Enter atau mengklik di luar node saat mode edit aktif
- **THEN** label tersimpan ke state lokal dan node kembali ke tampilan normal; indikator unsaved muncul

---

### Requirement: Hapus node dan subtree
Sistem SHALL menghapus node beserta seluruh keturunannya (subtree).

#### Scenario: Hapus node dengan child
- **WHEN** pengguna mengklik tombol "🗑️ Delete" pada sebuah node yang memiliki children
- **THEN** node tersebut dan semua keturunannya dihapus dari state, layout dikalkulasi ulang, indikator unsaved muncul

#### Scenario: Root node tidak bisa dihapus
- **WHEN** pengguna mengklik node root
- **THEN** tombol "🗑️ Delete" tidak ditampilkan

---

### Requirement: Auto-layout horizontal tree
Sistem SHALL menghitung ulang posisi semua node secara otomatis menggunakan dagre setiap kali struktur tree berubah.

#### Scenario: Re-layout saat tambah node
- **WHEN** node baru ditambahkan
- **THEN** semua posisi node dikalkulasi ulang oleh dagre dan canvas diupdate

#### Scenario: Re-layout saat hapus node
- **WHEN** node dihapus
- **THEN** semua posisi node dikalkulasi ulang oleh dagre dan canvas diupdate

---

### Requirement: Warna branch otomatis
Sistem SHALL menetapkan warna secara otomatis ke node level-1 dari palette yang telah ditentukan.

#### Scenario: Warna baru untuk branch baru
- **WHEN** child node langsung ditambahkan ke root node (membuat branch level-1 baru)
- **THEN** sistem menetapkan warna berikutnya yang tersedia dari palette `["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#f97316"]`

#### Scenario: Warna berputar jika palette habis
- **WHEN** jumlah branch level-1 melebihi 6
- **THEN** warna diulang dari awal palette

---

### Requirement: Manual save dengan indikator
Sistem SHALL menyediakan tombol save manual dan menampilkan status perubahan yang belum disimpan.

#### Scenario: Indikator unsaved muncul
- **WHEN** pengguna melakukan perubahan apapun (tambah/hapus/edit node)
- **THEN** indikator "● Unsaved" muncul di toolbar

#### Scenario: Simpan berhasil
- **WHEN** pengguna mengklik tombol "Save"
- **THEN** data dikirim ke API, indikator berubah menjadi "Saved", tombol Save dinonaktifkan

---

### Requirement: Navigasi kembali ke dashboard
Sistem SHALL menyediakan tombol untuk kembali ke dashboard dari editor.

#### Scenario: Kembali dengan perubahan unsaved
- **WHEN** pengguna mengklik "← Back" dengan perubahan yang belum disimpan
- **THEN** sistem menampilkan konfirmasi sebelum menavigasi pergi

#### Scenario: Kembali tanpa perubahan
- **WHEN** pengguna mengklik "← Back" tanpa perubahan unsaved
- **THEN** sistem langsung menavigasi ke dashboard
