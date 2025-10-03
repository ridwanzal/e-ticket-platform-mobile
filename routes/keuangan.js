const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');

// ---------------- LIST ----------------
router.get('/', async function (req, res, next) {
   if (!req.session.loggedin) {
      return res.render('pages/user-login', {
         messageContact: req.session.messageContact,
         title: 'E-Ibu Cerdas',
         type: 'website',
         canonical: 'E-Ibu Cerdas',
         author: 'E-Ibu Cerdas',
         description: 'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
         keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
         breadcrumbs: [
            { name: 'Home', link: '/' },
            { name: 'Kontak', link: '/kontak' }
         ]
      });
   }

   try {
      // Ambil list semua catatan
      const [rows] = await promisePool.query(
         "SELECT * FROM keuangan ORDER BY tanggal DESC"
      );

      // Ambil summary
      const [summaryRows] = await promisePool.query(
         `SELECT 
            COALESCE(SUM(CASE WHEN tipe = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS total_pemasukan,
            COALESCE(SUM(CASE WHEN tipe = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS total_pengeluaran,
            COALESCE(SUM(CASE WHEN tipe = 'investasi' THEN jumlah ELSE 0 END), 0) AS total_investasi,

            /* Saldo kas (uang tersedia) */
            COALESCE(SUM(
               CASE 
                  WHEN tipe = 'pemasukan' THEN jumlah
                  WHEN tipe = 'pengeluaran' THEN -jumlah
                  ELSE 0 
               END
            ), 0) AS saldo,

            /* Total aset (dari tabungan/investasi saja) */
            COALESCE(SUM(CASE WHEN tipe = 'investasi' THEN jumlah ELSE 0 END), 0) AS total_aset
         FROM keuangan`
      );

      const summary = summaryRows[0];

      res.render('pages/keuangan', {
         messageContact: req.session.messageContact,
         title: 'E-Ibu Cerdas',
         type: 'website',
         canonical: 'E-Ibu Cerdas',
         author: 'E-Ibu Cerdas',
         description:
            'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
         keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
         breadcrumbs: [
            { name: 'Home', link: '/' },
            { name: 'Keuangan', link: '/keuangan' },
         ],
         keuangan: rows,
         summary,
      });
   } catch (err) {
      console.error(err);
      next(err);
   }
});

// ---------------- REPORT ----------------
router.get('/report', async function (req, res, next) {
   if (!req.session.loggedin) {
      return res.render('pages/keuangan-report', {
         messageContact: req.session.messageContact,
         title: 'E-Ibu Cerdas',
         type: 'website',
         canonical: 'E-Ibu Cerdas',
         author: 'E-Ibu Cerdas',
         description: 'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
         keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
         breadcrumbs: [
            { name: 'Home', link: '/' },
            { name: 'Kontak', link: '/kontak' }
         ]
      });
   }

   try {
      const [rows] = await promisePool.query(
         "SELECT * FROM keuangan ORDER BY tanggal DESC"
      );

      const [summaryRows] = await promisePool.query(
         `SELECT 
            COALESCE(SUM(CASE WHEN tipe = 'pemasukan' THEN jumlah ELSE 0 END), 0) AS total_pemasukan,
            COALESCE(SUM(CASE WHEN tipe = 'pengeluaran' THEN jumlah ELSE 0 END), 0) AS total_pengeluaran,
            COALESCE(SUM(CASE WHEN tipe = 'investasi' THEN jumlah ELSE 0 END), 0) AS total_investasi,

            /* Saldo kas (uang tersedia) */
            COALESCE(SUM(
               CASE 
                  WHEN tipe = 'pemasukan' THEN jumlah
                  WHEN tipe = 'pengeluaran' THEN -jumlah
                  ELSE 0 
               END
            ), 0) AS saldo,

            /* Total aset (dari tabungan/investasi saja) */
            COALESCE(SUM(CASE WHEN tipe = 'investasi' THEN jumlah ELSE 0 END), 0) AS total_aset
         FROM keuangan`
      );

      const summary = summaryRows[0];
      const pemasukan = rows.filter(item => item.tipe === "pemasukan");
      const pengeluaran = rows.filter(item => item.tipe === "pengeluaran");
      const investasi = rows.filter(item => item.tipe === "investasi");

      res.render('pages/keuangan-report', {
         messageContact: req.session.messageContact,
         title: 'E-Ibu Cerdas',
         type: 'website',
         canonical: 'E-Ibu Cerdas',
         author: 'E-Ibu Cerdas',
         description: 'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
         keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
         breadcrumbs: [
            { name: 'Home', link: '/' },
            { name: 'Keuangan', link: '/keuangan' },
         ],
         keuangan: rows,
         pemasukan,
         pengeluaran,
         investasi,
         summary,
      });
   } catch (err) {
      console.error(err);
      next(err);
   }
});

// ---------------- ADD ----------------
router.get('/add', function (req, res) {
   if (!req.session.loggedin) {
      return res.redirect('/login');
   }

   res.render('pages/keuangan-add', {
      messageContact: req.session.messageContact,
      title: 'E-Ibu Cerdas',
      type: 'website',
      canonical: 'E-Ibu Cerdas',
      author: 'E-Ibu Cerdas',
      description: 'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
      keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
      breadcrumbs: [
         { name: 'Home', link: '/' },
         { name: 'Keuangan', link: '/keuangan' }
      ]
   });
});

// ---------------- EDIT ----------------
router.get('/edit/:id', async (req, res, next) => {
   try {
      const { id } = req.params;
      const [results] = await promisePool.query("SELECT * FROM keuangan WHERE id=? LIMIT 1", [id]);

      if (results.length === 0) {
         return res.status(404).send('Data tidak ditemukan');
      }

      res.render('pages/keuangan-edit', {
         item: results[0]
      });
   } catch (err) {
      console.error('Error fetch keuangan:', err);
      next(err);
   }
});

// ---------------- DELETE ----------------
router.get('/delete/:id', async function (req, res, next) {
   try {
      const { id } = req.params;
      await promisePool.query("DELETE FROM keuangan WHERE id=?", [id]);
      res.redirect('/keuangan');
   } catch (err) {
      console.error(err);
      next(err);
   }
});

module.exports = router;
