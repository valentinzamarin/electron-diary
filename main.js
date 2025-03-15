const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const desktopMainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    desktopMainWindow.setMenuBarVisibility(false)
    desktopMainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, 'database.sqlite');

ipcMain.on('add-post', (event, { title, content, tags }) => {
    const db = new sqlite3.Database(dbPath);
    db.run(
        'INSERT INTO posts (title, content) VALUES (?, ?)',
        [title, content],
        function (err) {
            if (err) {
                console.error('Ошибка при добавлении поста:', err.message);
            } else {
                const postId = this.lastID;
                tags.forEach(tag => {
                    db.run('INSERT INTO tags (post_id, tag) VALUES (?, ?)', [postId, tag]);
                });
                event.reply('post-added');
            }
        }
    );
});

ipcMain.on('load-posts', (event) => {
    const db = new sqlite3.Database(dbPath);
    db.all(
        'SELECT posts.*, GROUP_CONCAT(tags.tag) as tags FROM posts LEFT JOIN tags ON posts.id = tags.post_id GROUP BY posts.id',
        (err, rows) => {
            if (err) {
                console.error('Ошибка при загрузке постов:', err.message);
            } else {
                const posts = rows.map(row => ({
                    ...row,
                    tags: row.tags ? row.tags.split(',') : [],
                }));
                event.reply('load-posts', posts);
            }
        }
    );
});