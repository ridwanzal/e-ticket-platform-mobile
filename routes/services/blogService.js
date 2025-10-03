const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/db');
const { connection } = require('../../config/db');
const upload = require('../../middleware/uploaderSingle');
const path = require('path');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM blogs ORDER BY created_at DESC';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).json({ error: 'Gagal mengambil data artikel.' });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

router.post('/add', upload.single('thumbnail'), (req, res) => {
  const { author_id, title, slug, content, tag, uploader_name  } = req.body;
  const file = req.file;

  if (!author_id || !title || !content || !tag || !file || !uploader_name) {
    return res.status(400).json({ error: 'Semua field (author_id, title, content, tag, thumbnail, slug, uploader_name) wajib di isi.' });
  }

  const thumbnail = `${file.filename}`;

  const finalSlug = slug && slug.trim()
    ? slug.trim()
    : title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const now = new Date();

  const sql = `
    INSERT INTO blogs
      (author_id, title, content, tag, thumbnail, slug, uploader_name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [author_id, title, content, tag, thumbnail, finalSlug, uploader_name, now, now];

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error inserting into blogs:', err);
      return res.status(500).json({message: err, error: 'Gagal menyimpan data artikel.' });
    }

    return res.redirect('/admin?success=true');
  });
});

router.post('/edit/:id', upload.single('thumbnail'), (req, res) => {
  const { id } = req.params;
  const { author_id, title, slug, content, tag, uploader_name } = req.body;
  const file = req.file;

  if (!author_id || !title || !content || !tag || !uploader_name) {
    return res.status(400).json({
      error: 'Field (author_id, title, content, tag, uploader_name) wajib diisi.'
    });
  }

  const finalSlug = slug && slug.trim()
    ? slug.trim()
    : title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

  const now = new Date();

  const updateFields = [
    'author_id = ?',
    'title = ?',
    'content = ?',
    'tag = ?',
    'slug = ?',
    'uploader_name = ?',
    'updated_at = ?'
  ];
  const params = [
    author_id,
    title,
    content,
    tag,
    finalSlug,
    uploader_name,
    now
  ];

  // ✅ Cek apakah file upload ada
  if (file && file.filename) {
    updateFields.push('thumbnail = ?');
    params.push(file.filename);
  }

  params.push(id); // for WHERE id = ?

  const sql = `
    UPDATE blogs
    SET ${updateFields.join(', ')}
    WHERE id = ?
  `;

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating article:', err);
      return res.status(500).json({ message: err, error: 'Gagal memperbarui artikel.' });
    }

    return res.redirect('/admin?updated=true');
  });
});

router.post('/delete/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT * FROM blogs WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error checking blog:', err);
      return res.status(500).json({ error: 'Terjadi kesalahan saat mengecek artikel.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    connection.query('DELETE FROM blogs WHERE id = ?', [id], (errDelete, resultDelete) => {
      if (errDelete) {
        console.error('Error deleting blog:', errDelete);
        return res.status(500).json({ error: 'Gagal menghapus artikel.' });
      }

      return res.redirect('/admin?deleted=true');
    });
  });
});


module.exports = router;
