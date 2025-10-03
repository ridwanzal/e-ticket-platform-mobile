// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'public', 'uploads');

// Ensure upload path exists
if (!fs.existsSync(uploadPath)) {
   fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, uploadPath);
   },
   filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
      cb(null, uniqueName);
   }
});

const upload = multer({ storage });

module.exports = upload;
