import { app, BrowserWindow, dialog, ipcMain, Notification } from 'electron';
import path from 'path';

function createWindow() {
  console.log('__dirname:', __dirname);
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
        icon: path.join(__dirname, '../dist/ToDoLex.ico'),
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist-electron/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (!app.isPackaged) {
    win.loadURL('http://localhost:8080');
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading file from:', indexPath);
    try {
      win.loadFile(indexPath);
    } catch (e) {
      console.error('Failed to load file:', e);
      if (e instanceof Error) {
        dialog.showErrorBox('Failed to load file', e.message);
      } else {
        dialog.showErrorBox('Failed to load file', String(e));
      }
    }
  }
}

app.whenReady().then(() => {
  try {
    createWindow();
  } catch (e) {
    console.error('Failed to create window:', e);
    if (e instanceof Error) {
      dialog.showErrorBox('Failed to create window', e.message);
    } else {
      dialog.showErrorBox('Failed to create window', String(e));
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      try {
        createWindow();
      } catch (e) {
        console.error('Failed to create window on activate:', e);
        if (e instanceof Error) {
          dialog.showErrorBox('Failed to create window on activate', e.message);
        } else {
          dialog.showErrorBox('Failed to create window on activate', String(e));
        }
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('show-notification', (event, { title, body }) => {
  console.log(`[Main Process] Received notification request: Title=${title}`);
  if (Notification.isSupported()) {
    console.log('[Main Process] Notifications are supported.');
    try {
      const notification = new Notification({ 
        title, 
        body, 
        silent: false,
        icon: path.join(__dirname, '../dist/ToDoLex.png') // Correct path for packaged app
      });
      notification.show();
      console.log('[Main Process] Notification shown successfully.');
      return true;
    } catch (e) {
      console.error('[Main Process] Error showing notification:', e);
      return false;
    }
  } else {
    console.log('[Main Process] Notifications are NOT supported on this system.');
    return false;
  }
});
