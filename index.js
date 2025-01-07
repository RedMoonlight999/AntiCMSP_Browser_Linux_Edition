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
    win.loadURL('https://anticmsp-browser.vercel.app/');

    ipcMain.on('devtools', () => {
        if (win.webContents.isDevToolsOpened()) {
            win.webContents.closeDevTools();
        } else {
            win.webContents.openDevTools();
        }
    });
    ipcMain.on('shortcut', (event, args) => {
        const shortcut = args[0];
        switch (shortcut) {
            case 'reloadBrowser':
                win.webContents.reload();
                break;
            case 'reloadPage':
                win.webContents.executeJavaScript('document.querySelector("#reloadPage").click()');
                break;
            case 'devToolsBrowser':
                win.webContents.openDevTools();
                break;
            case 'devToolsPage':
                win.webContents.executeJavaScript('document.querySelector("webview").openDevTools()');
                break;
            default:
                win.webContents.executeJavaScript('window.alert("Atalho inexistente")');
                break;
            }
    }
)
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
