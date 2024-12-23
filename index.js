const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require('electron');
const path = require('path');

let win;

function createWindow() {
    Menu.setApplicationMenu(null);

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,  
            contextIsolation: false, 
            webSecurity: false,  
            webviewTag: true,
            nodeIntegrationInSubFrames: true
        }
    });
    win.loadFile(path.join(__dirname, '/layout/index.html'));

    ipcMain.on('devtools', () => {
        if (win.webContents.isDevToolsOpened()) {
            win.webContents.closeDevTools();
        } else {
            win.webContents.openDevTools();
        }
    });
    ipcMain.on('shortcut', (event, args) => {
        const shortcut = args[0];
        if (shortcut === 'reloadBrowser') {
            win.webContents.reload();
        } else if (shortcut === 'reloadPage') {
            win.webContents.executeJavaScript('document.querySelector("#reloadPage").click();');
        } else if (shortcut === 'devToolsBrowser') {
            win.webContents.openDevTools();
        } else if (shortcut === 'devToolsPage') {
            win.webContents.executeJavaScript('document.querySelector("webview").openDevTools();');
        } else {
            win.webContents.executeJavaScript('window.alert("Atalho inexistente")');
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    win.maximize();

    globalShortcut.register('Control+Shift+R', () => {
        if (win && win.webContents) {
            win.webContents.reload();
        }
    });
    globalShortcut.register('Control+R', () => {
        if (win && win.webContents) {
            win.webContents.executeJavaScript('document.querySelector("#reloadPage").click();');
        }
    });
    globalShortcut.register('F5', () => {
        if (win && win.webContents) {
            win.webContents.executeJavaScript('document.querySelector("#reloadPage").click();');
        }
    });
    globalShortcut.register('Control+Shift+Alt+I', () => {
        if (win && win.webContents) {
            win.webContents.openDevTools();
        }
    });
    globalShortcut.register('Control+Shift+I', () => {
        if (win && win.webContents) {
            win.webContents.executeJavaScript('document.querySelector("webview").openDevTools();');
        }
    });
    globalShortcut.register('Control+`', () => {
        if (win && win.webContents) {
            win.webContents.executeJavaScript('document.querySelector("webview").openDevTools();');
        }
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});