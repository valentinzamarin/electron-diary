import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');


export function initializeDatabase() {
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


export async function addPost(title, content, tags) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.run(
            'INSERT INTO posts (title, content) VALUES (?, ?)',
            [title, content],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    const postId = this.lastID;
                    tags.forEach(tag => {
                        db.run('INSERT INTO tags (post_id, tag) VALUES (?, ?)', [postId, tag]);
                    });
                    resolve();
                }
            }
        );
    });
}


export async function loadPosts() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.all(
            `SELECT posts.*, GROUP_CONCAT(tags.tag) as tags 
       FROM posts 
       LEFT JOIN tags ON posts.id = tags.post_id 
       GROUP BY posts.id`,
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const posts = rows.map(row => ({
                        ...row,
                        tags: row.tags ? row.tags.split(',') : [],
                    }));
                    resolve(posts);
                }
            }
        );
    });
}