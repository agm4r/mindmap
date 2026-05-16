### Requirement: Koneksi MongoDB Atlas dengan connection pooling
Sistem SHALL menggunakan singleton pattern untuk koneksi Mongoose agar connection pool tidak dibuat ulang di setiap request API.

#### Scenario: Koneksi reused antar request
- **WHEN** API route dipanggil berulang kali
- **THEN** sistem menggunakan koneksi Mongoose yang sudah ada, bukan membuat koneksi baru

---

### Requirement: Model Mindmap dengan embedded nodes
Sistem SHALL menyimpan setiap mind map sebagai satu dokumen MongoDB dengan nodes sebagai array embedded.

#### Scenario: Struktur dokumen
- **WHEN** mind map disimpan ke MongoDB
- **THEN** dokumen berisi field: `title` (string), `nodes` (array of node objects), `createdAt` (Date), `updatedAt` (Date)

#### Scenario: Struktur node dalam array
- **WHEN** node disimpan sebagai bagian dari mindmap
- **THEN** setiap node memiliki: `id` (string, unik dalam mindmap), `label` (string), `parentId` (string atau null), `color` (string atau null), `notes` (string atau undefined — HTML string dari Tiptap, opsional)

---

### Requirement: GET /api/mindmaps — list semua mind map
Sistem SHALL mengembalikan daftar semua mind map dengan field ringkas (tanpa nodes).

#### Scenario: List berhasil
- **WHEN** GET /api/mindmaps dipanggil
- **THEN** sistem mengembalikan HTTP 200 dengan array objek `{ _id, title, updatedAt }`

---

### Requirement: POST /api/mindmaps — buat mind map baru
Sistem SHALL membuat mind map baru dengan satu root node dan judul dari request body.

#### Scenario: Buat berhasil
- **WHEN** POST /api/mindmaps dipanggil dengan `{ title: string }`
- **THEN** sistem membuat dokumen baru dengan root node `{ id: "root", label: "Central Idea", parentId: null, color: null }` dan mengembalikan HTTP 201 dengan dokumen lengkap

---

### Requirement: GET /api/mindmaps/[id] — ambil satu mind map
Sistem SHALL mengembalikan dokumen lengkap sebuah mind map termasuk semua nodes.

#### Scenario: Found
- **WHEN** GET /api/mindmaps/[id] dipanggil dengan id yang valid
- **THEN** sistem mengembalikan HTTP 200 dengan dokumen lengkap termasuk nodes

#### Scenario: Not found
- **WHEN** GET /api/mindmaps/[id] dipanggil dengan id yang tidak ada
- **THEN** sistem mengembalikan HTTP 404 dengan pesan error

---

### Requirement: PUT /api/mindmaps/[id] — update mind map
Sistem SHALL menggantikan seluruh array nodes dan/atau judul mind map.

#### Scenario: Update berhasil
- **WHEN** PUT /api/mindmaps/[id] dipanggil dengan `{ title?, nodes? }`
- **THEN** sistem mengupdate field yang dikirim, memperbarui `updatedAt`, dan mengembalikan HTTP 200 dengan dokumen terupdate

---

### Requirement: DELETE /api/mindmaps/[id] — hapus mind map
Sistem SHALL menghapus mind map secara permanen.

#### Scenario: Hapus berhasil
- **WHEN** DELETE /api/mindmaps/[id] dipanggil
- **THEN** sistem menghapus dokumen dan mengembalikan HTTP 200

#### Scenario: Not found
- **WHEN** DELETE /api/mindmaps/[id] dipanggil dengan id yang tidak ada
- **THEN** sistem mengembalikan HTTP 404
