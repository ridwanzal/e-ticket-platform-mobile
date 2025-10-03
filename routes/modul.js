const express = require('express');
const router = express.Router();
const { connection } = require('../config/db'); // sesuaikan path

// JSON hardcoded
const pdfListStatic = [
  {
    id: 1,
    title: "Modul 1. Misi Ibu Cerdas Di Era Digital.pdf",
    filename: "Modul 1. Misi Ibu Cerdas Di Era Digital.pdf"
  },
  {
    id: 2,
    title: "Modul 2. Mengenal Literasi Keuangan Keluarga.pdf",
    filename: "Modul 2. Mengenal Literasi Keuangan Keluarga.pdf"
  },
  {
    id: 3,
    title: "Modul 3. Membedakan Kebutuhan atau Keinginan.pdf",
    filename: "Modul 3. Membedakan Kebutuhan atau Keinginan.pdf"
  },
  {
    id: 4,
    title: "Modul 4. Menyusun Anggaran dan Mencatat Keuangan.pdf",
    filename: "Modul 4. Menyusun Anggaran dan Mencatat Keuangan.pdf"
  },
  {
    id: 5,
    title: "Modul 5. Bahaya Judi Online di Lingkungan Keluarga.pdf",
    filename: "Modul 5. Bahaya Judi Online di Lingkungan Keluarga.pdf"
  },
  {
    id: 6,
    title: "Modul 6. Deteksi dini dan komunikasi keluarga.pdf",
    filename: "Modul 6. Deteksi dini dan komunikasi keluarga.pdf"
  },
  {
    id: 7,
    title: "Modul 7. Pengenalan investasi legal dan aman.pdf",
    filename: "Modul 7. Pengenalan investasi legal dan aman.pdf"
  },
  {
    id: 8,
    title: "Modul 8. Simulasi investasi digital untuk pemula.pdf",
    filename: "Modul 8. Simulasi investasi digital untuk pemula.pdf"
  },
  {
    id: 9,
    title: "Modul 9. Ibu sebagai agen keuangan positif dalam keluarga.pdf",
    filename: "Modul 9. Ibu sebagai agen keuangan positif dalam keluarga.pdf"
  },
  {
    id: 10,
    title: "Modul 10. Refleksi & Rencana Aksi Keluarga Cerdas Finansial.pdf",
    filename: "Modul 10. Refleksi & Rencana Aksi Keluarga Cerdas Finansial.pdf"
  }
];

// Render halaman modul
router.get('/', (req, res) => {
  const sql = `SELECT id, title, filename, created_at 
               FROM modul 
               ORDER BY created_at DESC`;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("Internal Server Error");
    }

    // Gabungkan hasil DB (paling atas karena sudah di-order DESC)
    // dengan JSON statis
    const pdfList = [
      ...results,   // terbaru dari database dulu
      ...pdfListStatic
    ];

    res.render('pages/modul', {
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
      ],
      pdfList
    });
  });
});

// Endpoint JSON
router.get('/list', (req, res) => {
  const sql = `SELECT id, title, filename, created_at 
               FROM modul 
               ORDER BY created_at DESC`;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const pdfList = [
      ...results,
      ...pdfListStatic
    ];

    res.json(pdfList);
  });
});

module.exports = router;
