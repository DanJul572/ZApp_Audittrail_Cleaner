# ZApp_Audittrail_Cleaner

Menghapus data yang sudah melewati masa retensinya secara berkala. Service ini menentukan
sendiri **kapan** dan **sampai kapan** data dihapus, lalu mengeksekusinya.

## Job

| Job | Jadwal | Yang dihapus |
| --- | --- | --- |
| `logRetention` | Saat start, lalu setiap `LOG_RETENTION_INTERVAL_HOURS` (default 24) | Baris `auditTrails`, `auditLogins`, `logErrors` yang lebih tua dari `AUDIT_TRAIL_RETENTION_DAYS`, `AUDIT_LOGIN_RETENTION_DAYS`, `ERROR_LOG_RETENTION_DAYS` |

- Job hanya berjalan jika `LOG_RETENTION_ENABLED=true`; jika tidak, app langsung berhenti
  karena tidak ada pekerjaan.
- Retensi kosong atau `0` berarti tabel itu tidak pernah dibersihkan.
- Tabel dibersihkan satu per satu. Tabel yang gagal tidak menghentikan tabel lain dan dicoba
  lagi pada jadwal berikutnya.
- Nama tabel dicocokkan dengan daftar tetap di `src/tasks/auditTrail.js`; tabel lain ditolak.
- Penghapusan dilakukan per batch (`CLEANUP_BATCH_SIZE`, default 5000) agar tabel tidak
  terkunci lama.
- Prosesnya idempoten. Jalankan satu instance saja: instance kedua hanya mengulang pekerjaan
  yang sama.

### Menambah task baru (mis. draft, trash)

1. Tambah nama task di `src/enums/cleanupTask.js`.
2. Buat `src/tasks/<task>.js` yang mengekspor `run(params)`, beserta service/query/builder-nya.
3. Daftarkan di `src/tasks/index.js`.
4. Buat job di `src/jobs/` yang menjalankan task tersebut, lalu jalankan di `app.js`.

## Menjalankan

```bash
cp .env.example .env   # lalu isi
pnpm install
pnpm dev
```

## Struktur

```
app.js            entry point: koneksi database dan job
src/
  config/         konfigurasi dari env
  jobs/           pekerjaan berkala (logRetention)
  tasks/          satu modul per jenis cleanup
  services/       logika penghapusan
  queries/        eksekusi query
  builders/       SQL
  enums/
  models/
```
