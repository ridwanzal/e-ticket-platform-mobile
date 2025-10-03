const express = require('express');
const router = express.Router();
const { connection } = require('../../config/db');
const upload = require('../../middleware/uploaderSingle'); // multer.diskStorage
const path = require('path');
const fs = require('fs');

// ffmpeg-static + fluent-ffmpeg
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// ==========================
// Upload & Compress Video
// ==========================
router.post('/add', upload.array('filename', 10), async (req, res) => {
  const createdAt = new Date();

  if (!req.files || req.files.length === 0) {
    req.session.flash = { type: 'error', message: 'Tidak ada file yang diunggah.' };
    return res.redirect('/managevideo');
  }

  try {
    const savedFiles = [];
    const uploadDir = path.join(__dirname, `../../public/uploads/`);
    fs.mkdirSync(uploadDir, { recursive: true });

    for (const [index, file] of req.files.entries()) {
      // Buat nama file unik
      const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname) || '.mp4';
      const filename = `vid_${uniqueId}_${index}${ext}`;
      const outputPath = path.join(uploadDir, filename);

      // 🔹 Compress & convert with ffmpeg-static
      await new Promise((resolve, reject) => {
        ffmpeg(file.path)
          .outputOptions([
            '-c:v libx264',
            '-crf 32',           // stronger compression
            '-preset slow',      // better compression, slower encode
            '-vf scale=-2:720',  // resize to 720p
            '-c:a aac',
            '-b:a 96k'           // smaller audio bitrate
          ])
          .save(outputPath)
          .on('end', () => {
            // hapus file temp multer
            fs.unlink(file.path, (err) => {
              if (err) console.error('Gagal hapus file temp:', err);
            });
            savedFiles.push({
              filename,
              created_at: createdAt
            });
            resolve();
          })
          .on('error', (err) => {
            console.error('ffmpeg error:', err);
            reject(err);
          });
      });
    }

    // Simpan ke database
    const insertSql = `
      INSERT INTO video (filename, created_at)
      VALUES ?
    `;
    const values = savedFiles.map(file => [
      file.filename,
      file.created_at
    ]);

    await new Promise((resolve, reject) => {
      connection.query(insertSql, [values], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    req.session.flash = { type: 'success', message: "Video berhasil diunggah & dikompres." };
    res.redirect('/managevideo');
  } catch (error) {
    console.error('Upload error:', error);
    req.session.flash = { type: 'error', message: "Gagal mengunggah video." };
    res.redirect('/managevideo');
  }
});

// ==========================
// Delete Video
// ==========================
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT filename FROM video WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Fetch error:', err);
      req.session.flash = { type: 'error', message: 'Gagal mencari video.' };
      return res.redirect('/managevideo');
    }

    if (results.length === 0) {
      req.session.flash = { type: 'error', message: "Video tidak ditemukan." };
      return res.redirect('/managevideo');
    }

    const filePath = path.join(__dirname, '../../public/uploads', results[0].filename);

    // Hapus dari database
    connection.query('DELETE FROM video WHERE id = ?', [id], (err2) => {
      if (err2) {
        console.error('Delete error:', err2);
        req.session.flash = { type: 'error', message: "Gagal menghapus video." };
        return res.redirect('/managevideo');
      }

      // Hapus file dari disk
      fs.unlink(filePath, (fsErr) => {
        if (fsErr) console.error('File delete error:', fsErr);

        req.session.flash = { type: 'success', message: "Video berhasil dihapus." };
        res.redirect('/managevideo');
      });
    });
  });
});

module.exports = router;
