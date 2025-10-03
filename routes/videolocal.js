const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path ke file JSON lokal
const CACHE_FILE = path.join(__dirname, '../cache/video_local_cache.json');

// Baca cache dengan aman
function readCacheSafe(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8').trim();
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// Simpan cache dengan aman
function saveCacheSafe(filePath, data) {
    try {
        const tmpPath = filePath + '.tmp';
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
        fs.renameSync(tmpPath, filePath);
    } catch (err) {
        console.error('Failed to save cache:', err);
    }
}

// Route untuk tampilkan daftar video
router.get('/', async function (req, res) {
    try {
        // Ambil daftar video dari file JSON lokal
        let videos = readCacheSafe(CACHE_FILE);

        // Kalau kosong, bisa siapkan default kosong atau isi awal
        if (!videos.length) {
            videos = [
                {
                    title: 'Contoh Video 1',
                    path: '/videos/Vidio Modul 3.mp4',
                    description: 'Video lokal pertama'
                },
                {
                    title: 'Contoh Video 2',
                    path: '/videos/Vidio Modul 4.mp4',
                    description: 'Video lokal kedua'
                }
            ];

            // Simpan ke file JSON supaya permanen
            saveCacheSafe(CACHE_FILE, videos);
        }

        // Kirim ke view
        res.render('pages/video', {
            title: 'Video List - E-Ibu Cerdas',
            description: 'Kumpulan video edukasi dan inspirasi dari E-Ibu Cerdas.',
            videos
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load local video list');
    }
});

module.exports = router;
