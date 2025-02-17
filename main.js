// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,    // Voor extra veiligheid
      contextIsolation: true,    // Verplicht als je preload gebruikt
    },
  });

  // Tijdens development: laad de React devserver
  win.loadURL('http://localhost:3000');
  // Na build: gebruik bijvoorbeeld win.loadFile('app/build/index.html');
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
