// routes/services/modulService.js
const express = require('express');
const router = express.Router();
const { connection } = require('../../config/db');
const upload = require('../../middleware/uploaderSingle'); // multer.diskStorage
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

// ==========================
// Upload Modul (PDF Only + Compression)
// ==========================
router.post('/add', upload.single('filename'), async (req, res) => {
  const createdAt = new Date();
  const { title } = req.body;

  if (!req.file) {
    req.session.flash = { type: 'error', message: 'Tidak ada file yang diunggah.' };
    return res.redirect('/managemodul');
  }

  if (!title || title.trim() === '') {
    req.session.flash = { type: 'error', message: 'Judul modul wajib diisi.' };
    return res.redirect('/managemodul');
  }

  try {
    const uploadDir = path.join(__dirname, `../../public/pdf/`);
    fs.mkdirSync(uploadDir, { recursive: true }); 

    // Validasi hanya PDF
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      fs.unlinkSync(req.file.path); // hapus file temp
      req.session.flash = { type: 'error', message: 'Hanya file PDF yang diperbolehkan.' };
      return res.redirect('/managemodul');
    }

    // Buat nama file unik
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `modul_${uniqueId}.pdf`;
    const outputPath = path.join(uploadDir, filename);

    // ==========================
    // Kompresi PDF pakai pdf-lib
    // ==========================
    const existingPdfBytes = fs.readFileSync(req.file.path);

    // Load existing PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });

    // Buat PDF baru untuk menulis ulang (subset font & buang metadata)
    const compressedPdf = await PDFDocument.create();
    const copiedPages = await compressedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

    copiedPages.forEach((page) => {
      compressedPdf.addPage(page);
    });

    // Hilangkan metadata untuk mengecilkan ukuran
    compressedPdf.setTitle('');
    compressedPdf.setAuthor('');
    compressedPdf.setSubject('');
    compressedPdf.setKeywords([]);
    compressedPdf.setProducer('');
    compressedPdf.setCreator('');
    compressedPdf.setCreationDate(new Date());
    compressedPdf.setModificationDate(new Date());

    const compressedPdfBytes = await compressedPdf.save({ useObjectStreams: true });

    // Simpan hasil ke folder upload
    fs.writeFileSync(outputPath, compressedPdfBytes);

    // Hapus file temp
    fs.unlinkSync(req.file.path);

    // Simpan ke database (title + filename)
    const insertSql = `
      INSERT INTO modul (title, filename, created_at)
      VALUES (?, ?, ?)
    `;
    await new Promise((resolve, reject) => {
      connection.query(insertSql, [title, filename, createdAt], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    req.session.flash = { type: 'success', message: "Modul berhasil diunggah & dikompres." };
    res.redirect('/managemodul');
  } catch (error) {
    console.error('Upload modul error:', error);
    req.session.flash = { type: 'error', message: "Gagal mengunggah modul." };
    res.redirect('/managemodul');
  }
});

// ==========================
// Delete Modul
// ==========================
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT filename FROM modul WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Fetch modul error:', err);
      req.session.flash = { type: 'error', message: 'Gagal mencari modul.' };
      return res.redirect('/managemodul');
    }

    if (results.length === 0) {
      req.session.flash = { type: 'error', message: "Modul tidak ditemukan." };
      return res.redirect('/managemodul');
    }

    const filePath = path.join(__dirname, '../../public/pdf', results[0].filename);

    // Hapus dari database
    connection.query('DELETE FROM modul WHERE id = ?', [id], (err2) => {
      if (err2) {
        console.error('Delete modul error:', err2);
        req.session.flash = { type: 'error', message: "Gagal menghapus modul." };
        return res.redirect('/managemodul');
      }

      // Hapus file dari disk
      fs.unlink(filePath, (fsErr) => {
        if (fsErr) console.error('File delete error:', fsErr);

        req.session.flash = { type: 'success', message: "Modul berhasil dihapus." };
        res.redirect('/managemodul');
      });
    });
  });
});

module.exports = router;
