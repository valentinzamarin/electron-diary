const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
});