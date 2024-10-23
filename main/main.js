import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow; // 전체화면 전환을 위한 윈도우 변수

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 868,
        frame: false,
        webPreferences: {
            nodeIntegration: false, // 보안상 false로 설정
            contextIsolation: true,  // true로 설정하여 보안 강화
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL('http://192.168.219.102:3000'); // 올바른 URL 확인
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


ipcMain.on('close-app', () => {
    app.quit();
});

ipcMain.on('minimize-app', () => {
    mainWindow.minimize(); // mainWindow를 사용하여 최소화
});

ipcMain.on('maximize-app', () => {
    mainWindow.maximize(); // mainWindow를 사용하여 최대화
});

// 로그인 성공 시 전체화면으로 전환
ipcMain.on('login-success', () => {
    if (mainWindow) {
        mainWindow.setFullScreen(true); // 전체화면으로 전환
    }
});