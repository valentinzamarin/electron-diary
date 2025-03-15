import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initializeDatabase, addPost, loadPosts } from './database.js';


initializeDatabase();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(process.cwd(), 'src/preload.js'),
        },
    });


    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(process.cwd(), 'dist/index.html'));
    }
}


ipcMain.handle('add-post', async (event, { title, content, tags }) => {
    await addPost(title, content, tags);
});

ipcMain.handle('load-posts', async () => {
    return await loadPosts();
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});