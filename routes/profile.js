const express = require('express');
const { link } = require('fs');
const router = express.Router();
const { promisePool } = require('../config/db');
const { connection } = require('../config/db');

router.get('/', function (req, res, next) {
   console.log(req.session.loggedin);
   if (req.session.loggedin) {
      console.log(req.session)
      res.render('pages/profile', {
         messageContact: req.session.messageContact,
         title: 'E-Ibu Cerdas',
         type: 'website',
         canonical: 'E-Ibu Cerdas',
         author: 'E-Ibu Cerdas',
         description: 'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
         keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
         breadcrumbs: [
            {
               name: 'Home',
               link: '/'
            },
            {
               name: 'Kontak',
               link: '/kontak'
            }
         ],
         sessions: req.session
      });
   }
   else{
      res.render('pages/user-login', {
         messageContact: req.session.messageContact,
         title: 'E-Ibu Cerdas',
         type: 'website',
         canonical: 'E-Ibu Cerdas',
         author: 'E-Ibu Cerdas',
         description: 'E-Ibu Cerdas adalah platform edukasi dan investasi yang membantu ibu-ibu cerdas dalam mengelola keuangan keluarga.',
         keywords: 'E-Ibu Cerdas, Investasi, Edukasi',
         breadcrumbs: [
            {
               name: 'Home',
               link: '/'
            },
            {
               name: 'Kontak',
               link: '/kontak'
            }
         ]
      });
   }
});

module.exports = router;