"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log('[Preload] Script loaded.');
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    showNotification: (options) => {
        console.log(`[Preload] Calling ipcRenderer.invoke with:`, options);
        return electron_1.ipcRenderer.invoke('show-notification', options);
    }
});
