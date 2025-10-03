const express = require('express');
const router = express.Router();
const { connection } = require('../config/db');

router.get('/', function (req, res, next) {
 connection.query('SELECT * FROM whatsapp LIMIT 1', (err, results) => {
    if (err) throw err;
    res.render('pages/managewhatsapp', {
      whatsapp: results || null,
      flash: req.session.flash
    });
    req.session.flash = null; // reset flash
  });
});

module.exports = router;
