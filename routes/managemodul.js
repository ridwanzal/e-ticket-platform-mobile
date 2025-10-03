const express = require('express');
const router = express.Router();
const { connection } = require('../config/db');

// ==============================
// Halaman Manage Modul
// ==============================
router.get('/', function (req, res, next) {
  connection.query('SELECT * FROM modul ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetch modul:', err);
      req.session.flash = { type: 'error', message: 'Gagal mengambil data modul.' };
      return res.render('pages/managemodul', {
        title: 'Admin - EIbuCerdas',
        type: 'website',
        author: 'EIbuCerdas',
        canonical: '',
        description: 'Membantu klien untuk membangun produk digital mereka, web dan mobile app dengan kualitas terbaik dari Payung Madinah',
        breadcrumbs: [
          { name: 'Login', link: '/' },
          { name: 'Manage Modul' }
        ],
        flash: req.session.flash,
        modul: []
      });
    }

    res.render('pages/managemodul', {
      title: 'Admin - EIbuCerdas',
      type: 'website',
      author: 'EIbuCerdas',
      canonical: '',
      description: 'Membantu klien untuk membangun produk digital mereka, web dan mobile app dengan kualitas terbaik dari Payung Madinah',
      breadcrumbs: [
        { name: 'Login', link: '/' },
        { name: 'Manage Modul' }
      ],
      flash: req.session.flash,
      modul: results
    });
    req.session.flash = null; // reset flash setelah render
  });
});

module.exports = router;
