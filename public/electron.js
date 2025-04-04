const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const { exec } = require('child_process');


const windowUrl = app.isPackaged
  ? `file://${path.join(__dirname, '../build/index.mdx')}`
  : `http://localhost:3000`;

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // ← You'll define this next
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.loadURL(windowUrl);
  mainWindow.on(`closed`, () => (mainWindow = null));
}

app.on(`ready`, createWindow);

app.on(`window-all-closed`, () => {
  if (process.platform !== `darwin`) {
    app.quit();
  }
});

//app.whenReady().then(createWindow);

app.on(`activate`, () => {
  //if (mainWindow === null) {
  //  createWindow();
  //}
});


ipcMain.handle('gene-info-pyton', async (event, geneName) => {
  return new Promise((resolve, reject) => {
    exec(`python3 scripts/fetch_gene.py ${geneName}`, (error, stdout, stderr) => { // Pass the geneName as an argument to the Python script
      if (error) reject(error.message);
      else if (stderr) reject(stderr);
      else resolve(stdout);
    });
  });
});


