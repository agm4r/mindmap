### Requirement: List semua mind map
Sistem SHALL menampilkan daftar semua mind map milik pengguna pada halaman `/`, diurutkan berdasarkan `updatedAt` terbaru.

#### Scenario: Daftar tampil dengan data
- **WHEN** pengguna membuka halaman `/`
- **THEN** sistem menampilkan card untuk setiap mind map dengan judul dan tanggal terakhir diubah

#### Scenario: Daftar kosong
- **WHEN** pengguna belum memiliki mind map
- **THEN** sistem menampilkan pesan kosong dan tombol untuk membuat mind map pertama

---

### Requirement: Buat mind map baru
Sistem SHALL memungkinkan pengguna membuat mind map baru dari dashboard dengan judul yang dapat diubah.

#### Scenario: Buat mind map dengan judul default
- **WHEN** pengguna mengklik tombol "+ New Mind Map"
- **THEN** sistem membuat mind map baru dengan judul "Untitled Mind Map", satu root node berlabel "Central Idea", lalu redirect ke `/map/[id]`

---

### Requirement: Hapus mind map
Sistem SHALL memungkinkan pengguna menghapus mind map dari dashboard setelah konfirmasi.

#### Scenario: Konfirmasi sebelum hapus
- **WHEN** pengguna mengklik tombol hapus pada sebuah mind map
- **THEN** sistem menampilkan dialog konfirmasi sebelum menghapus

#### Scenario: Hapus berhasil
- **WHEN** pengguna mengkonfirmasi penghapusan
- **THEN** sistem menghapus mind map dari database dan menghilangkannya dari daftar tanpa reload halaman

---

### Requirement: Navigasi ke editor
Sistem SHALL memungkinkan pengguna membuka editor mind map dari dashboard.

#### Scenario: Buka editor
- **WHEN** pengguna mengklik card atau tombol "Open" pada sebuah mind map
- **THEN** sistem menavigasi pengguna ke halaman `/map/[id]` yang sesuai
