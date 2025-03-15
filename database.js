const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');


function initializeDatabase() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Ошибка при подключении к базе данных:', err.message);
    } else {
      console.log('Подключение к базе данных успешно установлено.');
      createTables(db);
    }
  });
}


function createTables(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      tag TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts (id)
    )
  `);

  console.log('Таблицы созданы или уже существуют.');
}


module.exports = {
  initializeDatabase,
};