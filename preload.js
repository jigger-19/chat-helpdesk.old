// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Voorbeeldfunctie om berichten te versturen via IPC
  sendMessage: (message) => ipcRenderer.send('send-message', message),
  // Luister naar berichten vanuit de main process
  onMessage: (callback) => ipcRenderer.on('receive-message', (event, ...args) => callback(...args))
});
