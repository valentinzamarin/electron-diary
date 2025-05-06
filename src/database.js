// полностью переписанный файл базы
// который исключает базу из исходных файлов
// и перемещает её в C:\Users\{$username}\AppData\Roaming\${app_title}

import { app } from 'electron';
import path from 'path';
import fs from 'fs';

import sqlite3 from 'sqlite3';


let db = null;

function getDatabasePath() {

    const userDataPath = app.getPath('userData');

    const dbFileName = 'database.sqlite';

    const dbPath = path.join(userDataPath, dbFileName);
    return dbPath;
}


export function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const dbPath = getDatabasePath();

        const userDataDir = path.dirname(dbPath);
        if (!fs.existsSync(userDataDir)) {

            fs.mkdirSync(userDataDir, { recursive: true });
        }

        const dbFileExists = fs.existsSync(dbPath);

        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Ошибка при подключении или создании базы данных:', err.message);

                db = null;
                reject(err);
            } else {

                if (!dbFileExists) {
                    console.log('Файл базы данных не найден, создаем новый и инициализируем таблицы.');
                    createTables(db).then(() => resolve()).catch(reject);
                } else {
                    console.log('Файл базы данных найден.');
                    resolve();
                }
            }
        });
    });
}


function createTables(databaseInstance) {
    const dbToUse = databaseInstance || db;
    if (!dbToUse) {
        return Promise.reject(new Error("Database not initialized when trying to create tables."));
    }

    return new Promise((resolve, reject) => {
        dbToUse.run(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Ошибка при создании таблицы posts:', err.message);
                reject(err);
            } else {
                console.log('Таблица posts проверена/создана.');
                resolve();
            }
        });
    });
}


function checkDatabaseInitialized() {
    if (!db) {
        throw new Error("Database not initialized. Call initializeDatabase first.");
    }
    return db;
}


export async function addPost(title, content) {
    const db = checkDatabaseInitialized();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO posts (title, content) VALUES (?, ?)',
            [title, content],
            function (err) {
                if (err) {
                    console.error('Ошибка при добавлении поста:', err.message);
                    reject(err);
                } else {

                    console.log(`Пост добавлен с ID: ${this.lastID}`);
                    resolve(this.lastID);
                }

            }
        );
    });
}

export async function loadPosts() {
    const db = checkDatabaseInitialized();
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM posts ORDER BY created_at DESC`,
            (err, rows) => {
                if (err) {
                    console.error('Ошибка при загрузке постов:', err.message);
                    reject(err);
                } else {
                    console.log(`Загружено постов: ${rows.length}`);
                    resolve(rows);
                }
            }
        );
    });
}

export async function getPostById(postId) {
    const db = checkDatabaseInitialized();
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM posts WHERE id = ?`,
            [postId],
            (err, row) => {
                if (err) {
                    console.error('Ошибка при получении поста по ID:', err.message);
                    reject(err);
                } else {
                    console.log(`Получен пост с ID ${postId}: ${row ? 'найден' : 'не найден'}`);
                    resolve(row || null);
                }
            }
        );
    });
}

export async function updatePost(postId, title, content) {
    const db = checkDatabaseInitialized();
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [title, content, postId],
            function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {

                    resolve(this.changes > 0);
                }
            }
        );
    });
}

export async function deletePost(postId) {
    const db = checkDatabaseInitialized();
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM posts WHERE id = ?',
            [postId],
            function (err) {
                if (err) {
                    console.error('Ошибка при удалении поста:', err.message);
                    reject(err);
                } else {
                    // this.changes содержит количество удаленных строк
                    console.log(`Удален пост с ID ${postId}. Удалено строк: ${this.changes}`);
                    resolve(this.changes > 0); // Возвращаем true, если что-то удалено
                }
            }
        );
    });
}