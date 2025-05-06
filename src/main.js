import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initializeDatabase, addPost, loadPosts, getPostById, updatePost, deletePost } from './database.js';


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Получаем путь к текущему файлу как строку
const __dirname = path.dirname(__filename); // Получаем директорию, где лежит файл

initializeDatabase();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.setMenuBarVisibility(false)

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }
}


ipcMain.handle('add-post', async (event, { title, content }) => {
    await addPost(title, content);


    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach(win => {
        win.webContents.send('post-added');
    });
});

ipcMain.handle('load-posts', async () => {
    return await loadPosts();
});

ipcMain.handle('get-post-by-id', async (event, postId) => {
    try {
        const post = await getPostById(postId);
        return post;
    } catch (error) {
        console.error('Ошибка при получении поста:', error);
        throw error;
    }
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



ipcMain.handle('update-post', async (event, { postId, title, content }) => {
    try {
        await updatePost(postId, title, content);

        const allWindows = BrowserWindow.getAllWindows();
        allWindows.forEach(win => {
            win.webContents.send('post-updated');
        });

        return true; // Успешно обновлено
    } catch (error) {
        console.error('Ошибка при обновлении поста:', error);
        throw error;
    }
});

ipcMain.handle('delete-post', async (event, postId) => {
    try {
        await deletePost(postId);

        // Уведомляем все окна об удалении поста
        const allWindows = BrowserWindow.getAllWindows();
        allWindows.forEach(win => {
            win.webContents.send('post-deleted');
        });

        return true; // Успешно удалено
    } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        throw error;
    }
});