const express = require('express');
const router = express.Router();
const { connection } = require('../../config/db');

router.post('/add', function (req, res) {
  const phone = req.body.nomor_handphone; 

  if (!phone) {
    req.session.flash = { type: 'danger', message: 'Nomor WhatsApp wajib diisi.' };
    return res.redirect('/managewhatsapp');
  }

  const checkQuery = `SELECT * FROM whatsapp LIMIT 1`;

  connection.query(checkQuery, function (err, results) {
    if (err) throw err;

    if (results.length === 0) {
      const insertQuery = `INSERT INTO whatsapp (nomor_handphone) VALUES (?)`;
      connection.query(insertQuery, [phone], function (err2) {
        if (err2) throw err2;
        req.session.flash = { type: 'success', message: 'Nomor WhatsApp berhasil ditambahkan.' };
        res.redirect('/managewhatsapp');
      });
    } else {
      const updateQuery = `UPDATE whatsapp SET nomor_handphone = ? WHERE id = ?`;
      connection.query(updateQuery, [phone, results[0].id], function (err3) {
        if (err3) throw err3;
        req.session.flash = { type: 'success', message: 'Nomor WhatsApp berhasil diperbarui.' };
        res.redirect('/managewhatsapp');
      });
    }
  });
});

module.exports = router;
