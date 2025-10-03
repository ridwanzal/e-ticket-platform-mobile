const express = require('express');
const router = express.Router();
const { promisePool } = require('../../config/db');
const { connection } = require('../../config/db');
const bcrypt = require('bcrypt');

// POST /auth/login
router.post('/', (req, res) => {
  const { credential, password } = req.body;

  if (!credential || !password) {
    req.session.flash = { type: 'error', message: "Mohon isi semua form" };
    return res.redirect('/auth/');
  }

  const query = "SELECT id, name, gender, role, created_at, updated_at, password FROM users WHERE credential = ?";
  connection.query(query, [credential], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      req.session.flash = { type: 'error', message: "Internal Server Error" };
      return res.redirect('/auth/');
    }

    if (results.length === 0) {
      console.log("No user found with credential:", credential);
      req.session.flash = { type: 'error', message: "Password yang anda salah, Coba lagi" };
      return res.redirect('/auth/');
    }

    const user = results[0];
    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      console.error("Password mismatch for user:", credential);
      req.session.flash = { type: 'error', message: "Password yang anda salah, Coba lagi" };
      return res.redirect('/auth/');
    }

    req.session.loggedin = true;
    req.session.credential = credential;
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.createdAt = user.created_at;
    req.session.updatedAt = user.updated_at;
    req.session.name = user.name;
    req.session.gender = user.gender;
    req.session.age = user.age;
    req.session.profession = user.profession;
    req.session.phone_number = user.phone_number;
    req.session.address = user.address;
    req.session.flash = { type: 'success', message: "Login Berhasil" };
    req.session.flash = { type: 'success', message: "Login Berhasil. <a href='/auth'>Please log in.</a>" };
    return res.redirect('/');
  });
});


// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    req.session.flash = { type: 'error', message: "Semua form harus diisi." };
    return res.redirect('/auth/register');
  }

  if (password !== confirmPassword) {
    req.session.flash = { type: 'error', message: "Passwords tidak cocok." };
    return res.redirect('/auth/register');
  }

  try {
    const [rows] = await connection.promise().query(
      "SELECT id FROM users WHERE email = ? OR credential = ?",
      [email, email]
    );
    if (rows.length > 0) {
      req.session.flash = { type: 'error', message: "Email sudah terdaftar." };
      return res.redirect('/auth/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date();
    await connection.promise().query(
      `INSERT INTO users 
       (credential, name, email, password, password_plain, role, gender, age, profession, phone_number, address, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        email,
        name,
        email,
        hashedPassword,
        password,
        "user",
        "unknown",
        0,
        "-",
        "0",
        "-",
        now,
        now
      ]
    );

    req.session.flash = { type: 'success', message: "Pendaftaran Berhasil. <a href='/auth'>Please log in.</a>" };
    return res.redirect('/auth/register'); // ✅ after register → login page

  } catch (err) {
    console.error("Registration error:", err);
    req.session.flash = { type: 'error', message: "Internal Server Error." };
    return res.redirect('/auth/register');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      req.session.flash = { type: 'error', message: "Logout Gagal. Coba lagi." };
      return res.redirect('/');
    }

    res.clearCookie('connect.sid');
    
    return res.redirect('/auth/');
  });
});


module.exports = router;
