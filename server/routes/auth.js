// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Stel een geheim in voor JWT (bewaar dit in een .env-bestand in productie)
const JWT_SECRET = 'jouw_geheime_sleutel';

// MySQL verbinding importeren (zie hieronder)
const db = require('../db');

// Registratie route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' });
  }

  // Controleer of de gebruiker al bestaat
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database fout' });
    if (results.length > 0) {
      return res.status(400).json({ error: 'Gebruiker bestaat al' });
    }

    // Wachtwoord hashen
    const hashedPassword = await bcrypt.hash(password, 10);
    // Voeg de nieuwe gebruiker toe
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Database fout' });
        return res.status(201).json({ message: 'Registratie geslaagd' });
      }
    );
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email en wachtwoord zijn verplicht' });
  }

  // Zoek de gebruiker op
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database fout' });
    if (results.length === 0) {
      return res.status(400).json({ error: 'Ongeldige inloggegevens' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Ongeldige inloggegevens' });
    }

    // Genereer een JWT-token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Inloggen geslaagd', token });
  });
});

module.exports = router;
