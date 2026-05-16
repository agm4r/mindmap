## MODIFIED Requirements

### Requirement: Model Mindmap dengan embedded nodes
Sistem SHALL menyimpan setiap mind map sebagai satu dokumen MongoDB dengan nodes sebagai array embedded.

#### Scenario: Struktur dokumen
- **WHEN** mind map disimpan ke MongoDB
- **THEN** dokumen berisi field: `title` (string), `nodes` (array of node objects), `createdAt` (Date), `updatedAt` (Date)

#### Scenario: Struktur node dalam array
- **WHEN** node disimpan sebagai bagian dari mindmap
- **THEN** setiap node memiliki: `id` (string, unik dalam mindmap), `label` (string), `parentId` (string atau null), `color` (string atau null), `notes` (string atau undefined — HTML string dari Tiptap, opsional)
