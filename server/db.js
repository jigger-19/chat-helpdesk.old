// db.js
const mysql = require('mysql2');

// Maak een verbinding met jouw MySQL-server en database
const connection = mysql.createConnection({
  host: 'localhost',                // of een ander hostadres
  user: 'root',                     // jouw MySQL-gebruiker (bijv. root)
  password: 'Dennise',// vervang dit met jouw wachtwoord
  database: 'chat_app'              // de naam van jouw database
});

// Test de verbinding
connection.connect((err) => {
  if (err) {
    console.error('Fout bij verbinden met MySQL:', err);
    return;
  }
  console.log('Verbonden met MySQL!');
});

module.exports = connection;
