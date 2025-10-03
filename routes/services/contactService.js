const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/db');
const { connection } = require('../../config/db');

router.post('/', function (req, res, next) {
   let service_id = req.body.service_id;
   let nama_lengkap = req.body.nama_lengkap;
   let phone = req.body.phone;
   let email = req.body.email;
   let budget_est = req.body.budget_est;
   let description = req.body.description;

   let query = `INSERT INTO contact 
   (service_id,nama_lengkap,phone,email,budget_est,description) 
   VALUES 
   ('${service_id}','${nama_lengkap}','${phone}','${email}','${budget_est}','${description}')`;

   console.log(query);

   connection.query(query, function (err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
         req.session.messageContact = 'Thankyou, your submission success. We will contact you soon.';
         res.redirect('/kontak');
      } else {
         req.session.messageErro = 'Submission error';O
         res.redirect('/kontak');
      }
   });
});   

module.exports = router;