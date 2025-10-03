const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/db');
const { connection } = require('../../config/db');
const upload = require('../../middleware/uploaderSingle');
const path = require('path');

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM keuangan ORDER BY created_at DESC';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).json({ error: 'Gagal mengambil data pencatatan keuangan.' });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

router.post('/add', (req, res) => {
  const { user_id, keterangan, jumlah, tipe, tanggal } = req.body;

  if (!keterangan || !jumlah || !tipe || !tanggal) {
    return res.status(400).json({ error: 'Semua field (keterangan, jumlah, tipe, tanggal) wajib di isi.' });
  }

  const now = new Date();

  const sql = `
    INSERT INTO keuangan
      (user_id, keterangan, jumlah, tipe, tanggal, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [user_id, keterangan, jumlah, tipe, tanggal, now, now];

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error inserting into keuangan:', err);
      return res.status(500).json({message: err, error: 'Gagal menyimpan data pencatatan keuangan.' });
    }

    return res.redirect('/keuangan?success=true');
  });
});


module.exports = router;
