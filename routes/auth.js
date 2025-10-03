const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
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
});


router.get('/register', function (req, res, next) {
    res.render('pages/user-registration', {
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
          name: 'Register',
          link: '/Register'
        }
      ]
    });
});

module.exports = router;