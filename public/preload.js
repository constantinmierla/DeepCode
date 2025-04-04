const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getGeneInfo: (geneName) => ipcRenderer.invoke('gene-info-pyton', geneName), // Pass the geneName to the main process
});
