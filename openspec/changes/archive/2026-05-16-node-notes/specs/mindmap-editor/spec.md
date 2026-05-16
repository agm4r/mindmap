## ADDED Requirements

### Requirement: Tombol Notes di NodeToolbar
Sistem SHALL menampilkan tombol "Notes" pada NodeToolbar setiap node (termasuk root node), di samping tombol yang sudah ada.

#### Scenario: Tombol Notes tampil saat node dipilih
- **WHEN** pengguna mengklik sebuah node sehingga NodeToolbar muncul
- **THEN** NodeToolbar menampilkan tombol "Notes" di antara tombol-tombol yang ada

#### Scenario: Klik Notes membuka modal
- **WHEN** pengguna mengklik tombol "Notes" pada NodeToolbar
- **THEN** `onOpenNotes(id)` dipanggil dan modal catatan terbuka untuk node tersebut

---

### Requirement: State modal catatan di MindMapEditor
Sistem SHALL mengelola state `openNoteNodeId` untuk mengontrol modal catatan mana yang terbuka.

#### Scenario: Modal terbuka
- **WHEN** `onOpenNotes(nodeId)` dipanggil
- **THEN** `openNoteNodeId` di-set ke `nodeId` dan `NoteModal` dirender untuk node tersebut

#### Scenario: Modal tertutup
- **WHEN** user menutup modal
- **THEN** `openNoteNodeId` di-reset ke `null` dan modal tidak lagi dirender

---

### Requirement: Callback onNotesChange menyimpan catatan ke state
Sistem SHALL menyimpan perubahan catatan ke `dbNodes` state dan menandai `isDirty = true`.

#### Scenario: Catatan diubah
- **WHEN** `onNotesChange(nodeId, notes)` dipanggil saat modal ditutup dengan perubahan
- **THEN** field `notes` pada node yang sesuai diupdate di `dbNodes` dan `isDirty` di-set `true`
