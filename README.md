# ZApp_Audittrail_Cleaner

Menghapus data yang diperintahkan oleh ZApp_Worker_App. Worker menentukan **kapan** dan
**sampai kapan** data dihapus; service ini hanya mengeksekusi.

## Task

Consume `<NODE_ENV>_cleanup_queue`. Setiap pesan berisi `task` dan parameternya.

| Task | Pesan | Yang dihapus |
| --- | --- | --- |
| `auditTrail` | `{ task: 'auditTrail', table, before }` | Baris `auditTrails`, `auditLogins` atau `logErrors` dengan `createdAt < before` |

- Nama tabel dicocokkan dengan daftar tetap di `src/tasks/auditTrail.js`; tabel lain ditolak.
- Penghapusan dilakukan per batch (`CLEANUP_BATCH_SIZE`, default 5000) agar tabel tidak
  terkunci lama.
- Prosesnya idempoten: pesan yang datang dua kali tidak berbahaya.

### Menambah task baru (mis. draft, trash)

1. Tambah nama task di `src/enums/cleanupTask.js` (juga di ZApp_Worker_App).
2. Buat `src/tasks/<task>.js` yang mengekspor `run(message)`, beserta service/query/builder-nya.
3. Daftarkan di `src/tasks/index.js`.
4. Buat job di ZApp_Worker_App yang mengirim pesan task tersebut.

## Menjalankan

```bash
cp .env.example .env.development.local   # lalu isi
pnpm install
pnpm dev
```

## Struktur

```
app.js            entry point: koneksi database dan consumer
src/
  config/         konfigurasi dari env
  consumers/      consumer RabbitMQ
  tasks/          satu modul per jenis cleanup
  services/       logika penghapusan
  queries/        eksekusi query
  builders/       SQL
  helpers/        rabbitmq
  enums/
  models/
```
