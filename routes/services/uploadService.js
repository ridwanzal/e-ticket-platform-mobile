const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/db');
const { connection } = require('../../config/db');
const upload = require('../../middleware/uploaderSingle');

router.post('/', upload.single('fileme'), (req, res) => {
  const filename = req.file.filename;
  const query = `INSERT INTO uploads (filename) VALUES (?)`;
  connection.query(query, [filename], (err) => {
    if (err) throw err;
    console.log('1 record inserted');
    res.redirect('/admin/uploader');
  });
});

router.post('/delete/:id', (req, res) => {
  const id = req.params.id;

  const getQuery = `SELECT filename FROM uploads WHERE id = ?`;
  connection.query(getQuery, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(404).send('File not found');

    const filename = results[0].filename;
    const filePath = path.join(__dirname, '../../public/uploads', filename);

    // Delete the physical file
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') return res.status(500).send('File deletion error');

      // Delete the DB record
      const deleteQuery = `DELETE FROM uploads WHERE id = ?`;
      connection.query(deleteQuery, [id], (err) => {
        if (err) throw err;
        console.log('Deleted file and DB record');
        res.redirect('/admin/uploader');
      });
    });
  });
});


module.exports = router;