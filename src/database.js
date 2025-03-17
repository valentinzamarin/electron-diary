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
}

export async function addPost(title, content) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.run(
            'INSERT INTO posts (title, content) VALUES (?, ?)',
            [title, content],
            function (err) {
                if (err) {
                    reject(err);
                } else {
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
            `SELECT * FROM posts`,
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
}

export async function getPostById(postId) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.get(
            `SELECT * FROM posts WHERE id = ?`,
            [postId],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null);
                }
            }
        );
    });
}

export async function updatePost(postId, title, content) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.run(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [title, content, postId],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

export async function deletePost(postId) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath);
        db.run(
            'DELETE FROM posts WHERE id = ?',
            [postId],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}
