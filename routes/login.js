const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
   if (req.session.loggedin) { 
      res.redirect('/');
   }else {
      res.render('pages/admin/login', {
         title: 'Admin - Payung Madinah',
         type: "website",
         author: 'Payung Madinah',
         canonical: '',
         description: 'Membantu klien untuk membangun produk digital mereka, web dan mobile app dengan kualitas terbaik dari Payung Madinah',
         breadcrumbs: [
            {

               name: 'Login',
               link: '/'
            },
            {
               name: 'Link Page',
            }
         ]
      });
   }
});

module.exports = router;