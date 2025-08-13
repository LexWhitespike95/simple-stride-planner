import { contextBridge, ipcRenderer } from 'electron';

console.log('[Preload] Script loaded.');

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (options: { title: string; body: string; }) => {
    console.log(`[Preload] Calling ipcRenderer.invoke with:`, options);
    return ipcRenderer.invoke('show-notification', options);
  }
});