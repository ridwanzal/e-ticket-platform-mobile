const express = require('express');
const router = express.Router();
const { connection } = require('../config/db');

// ==============================
// Halaman Manage Video
// ==============================
router.get('/', function (req, res, next) {
  connection.query('SELECT * FROM video ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetch video:', err);
      req.session.flash = { type: 'error', message: 'Gagal mengambil data video.' };
      return res.render('pages/managevideo', {
        title: 'Admin - EIbuCerdas',
        type: 'website',
        author: 'EIbuCerdas',
        canonical: '',
        description: 'Membantu klien untuk membangun produk digital mereka, web dan mobile app dengan kualitas terbaik dari Payung Madinah',
        breadcrumbs: [
          { name: 'Login', link: '/' },
          { name: 'Manage Video' }
        ],
        flash: req.session.flash,
        videos: []
      });
    }

    res.render('pages/managevideo', {
      title: 'Admin - EIbuCerdas',
      type: 'website',
      author: 'EIbuCerdas',
      canonical: '',
      description: 'Membantu klien untuk membangun produk digital mereka, web dan mobile app dengan kualitas terbaik dari Payung Madinah',
      breadcrumbs: [
        { name: 'Login', link: '/' },
        { name: 'Manage Video' }
      ],
      flash: req.session.flash,
      videos: results
    });
    req.session.flash = null; // reset flash setelah render
  });
});

module.exports = router;
