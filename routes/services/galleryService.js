const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/db');
const { connection } = require('../../config/db');
const upload = require('../../middleware/uploaderSingle');

module.exports = router;

router.post('/add', upload.array('thumbnails', 10), async (req, res) => {
  const { namam, domisili, telepon, jawaban } = req.body;
  const createdAt = new Date().toISOString();
  const updatedAt = Math.floor(Date.now() / 1000);
  const formId = Date.now(); // Simulate unique ID, better to use DB auto_increment ideally

  const uploadDir = path.join(__dirname, '../../public/uploads', formId.toString());
  fs.mkdirSync(uploadDir, { recursive: true });

  const savedFiles = [];

  try {
    // Process each file
    for (const [index, file] of req.files.entries()) {
      const outputPath = path.join(uploadDir, `img_${index}.jpg`);
      await sharp(file.buffer)
        .resize(800)
        .jpeg({ quality: 70 })
        .toFile(outputPath);

      savedFiles.push({
        thumbnail: `/uploads/${formId}/img_${index}.jpg`,
        created_at: updatedAt,
      });
    }

    // Insert into umroh_gratis
    const umrohSql = `
      INSERT INTO umroh_gratis (id, nama, phone_number, domisili, jawaban, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const umrohParams = [
      formId,
      namam,
      telepon,
      domisili,
      jawaban,
      createdAt,
      updatedAt,
    ];

    await new Promise((resolve, reject) => {
      connection.query(umrohSql, umrohParams, (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Insert uploaded files
    const uploadsSql = `
      INSERT INTO umroh_gratis_uploads (id_umroh_gratis, thumnbnail, created_at)
      VALUES ?
    `;
    const uploadValues = savedFiles.map(file => [
      formId,
      file.thumbnail,
      file.created_at,
    ]);

    await new Promise((resolve, reject) => {
      connection.query(uploadsSql, [uploadValues], (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });

    req.session.success = 'Terima kasih, submisi anda sukses. Kami akan menghubungi anda segera.';
    res.redirect('/umroh-gratis');
  } catch (error) {
    console.error('Error submitting form:', error);
    req.session.error = 'Submisi anda gagal, cek kembali data yang anda isi.';
    res.redirect('/umroh-gratis');
  }
});

router.post('/delete/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM gallery WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Gagal menghapus image galeri.' });
    }
    res.redirect('/admin/galeri?galeri=deleted');
  });
});

module.exports = router;
