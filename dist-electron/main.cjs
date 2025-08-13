"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
function createWindow() {
    console.log('__dirname:', __dirname);
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        icon: path_1.default.join(__dirname, '../dist/ToDoLex.ico'),
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    if (!electron_1.app.isPackaged) {
        win.loadURL('http://localhost:8080');
        win.webContents.openDevTools();
    }
    else {
        const indexPath = path_1.default.join(__dirname, '../dist/index.html');
        console.log('Loading file from:', indexPath);
        try {
            win.loadFile(indexPath);
        }
        catch (e) {
            console.error('Failed to load file:', e);
            if (e instanceof Error) {
                electron_1.dialog.showErrorBox('Failed to load file', e.message);
            }
            else {
                electron_1.dialog.showErrorBox('Failed to load file', String(e));
            }
        }
    }
}
electron_1.app.whenReady().then(() => {
    try {
        createWindow();
    }
    catch (e) {
        console.error('Failed to create window:', e);
        if (e instanceof Error) {
            electron_1.dialog.showErrorBox('Failed to create window', e.message);
        }
        else {
            electron_1.dialog.showErrorBox('Failed to create window', String(e));
        }
    }
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            try {
                createWindow();
            }
            catch (e) {
                console.error('Failed to create window on activate:', e);
                if (e instanceof Error) {
                    electron_1.dialog.showErrorBox('Failed to create window on activate', e.message);
                }
                else {
                    electron_1.dialog.showErrorBox('Failed to create window on activate', String(e));
                }
            }
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.ipcMain.handle('show-notification', (event, { title, body }) => {
    console.log(`[Main Process] Received notification request: Title=${title}`);
    if (electron_1.Notification.isSupported()) {
        console.log('[Main Process] Notifications are supported.');
        try {
            const notification = new electron_1.Notification({
                title,
                body,
                silent: false,
                icon: path_1.default.join(__dirname, '../dist/ToDoLex.png') // Correct path for packaged app
            });
            notification.show();
            console.log('[Main Process] Notification shown successfully.');
            return true;
        }
        catch (e) {
            console.error('[Main Process] Error showing notification:', e);
            return false;
        }
    }
    else {
        console.log('[Main Process] Notifications are NOT supported on this system.');
        return false;
    }
});
