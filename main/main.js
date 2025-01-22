import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow; // 전체화면 전환을 위한 윈도우 변수

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 868,
        // frame: false,
        webPreferences: {
            nodeIntegration: false, // 보안상 false로 설정
            contextIsolation: true,  // true로 설정하여 보안 강화
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL('http://localhost:3000'); // 올바른 URL 확인
    mainWindow.setMenu(null);
    // 메뉴 커스터마이징
    // const menu = Menu.buildFromTemplate([
    //     {
    //         label: 'HOME',
    //         submenu: [
    //             {
    //                 label: 'HOME',
    //                 click: () => {
    //                     mainWindow.webContents.send('navigate-to', '/rfq_read'); // 클라이언트 측에서 페이지 이동 처리
    //                 }
    //             }
    //         ]
    //     },
    //     {
    //         label: '프로젝트',
    //         submenu: [
    //             {
    //                 label: '프로젝트 관리',
    //                 accelerator: 'CmdOrCtrl+Q',
    //                 click: () => {
    //                     app.quit();
    //                 }
    //             }
    //         ]
    //     },
    //     {
    //         label: '견적의뢰',
    //         submenu: [
    //             {
    //                 label: 'Reload',
    //                 accelerator: 'CmdOrCtrl+R',
    //                 click: () => {
    //                     mainWindow.reload();
    //                 }
    //             },
    //             {
    //                 label: 'Toggle Full Screen',
    //                 accelerator: 'F11',
    //                 click: () => {
    //                     mainWindow.setFullScreen(!mainWindow.isFullScreen());
    //                 }
    //             }
    //         ]
    //     },
    //     {
    //         label: '견적서',
    //         submenu: [
    //             {
    //                 label: 'Reload',
    //                 accelerator: 'CmdOrCtrl+R',
    //                 click: () => {
    //                     mainWindow.reload();
    //                 }
    //             },
    //             {
    //                 label: 'Toggle Full Screen',
    //                 accelerator: 'F11',
    //                 click: () => {
    //                     mainWindow.setFullScreen(!mainWindow.isFullScreen());
    //                 }
    //             }
    //         ]
    //     },
    //     {
    //         label: '발주',
    //         submenu: [
    //             {
    //                 label: 'Reload',
    //                 accelerator: 'CmdOrCtrl+R',
    //                 click: () => {
    //                     mainWindow.reload();
    //                 }
    //             },
    //             {
    //                 label: 'Toggle Full Screen',
    //                 accelerator: 'F11',
    //                 click: () => {
    //                     mainWindow.setFullScreen(!mainWindow.isFullScreen());
    //                 }
    //             }
    //         ]
    //     },
    //     {
    //         label: 'Maker',
    //         submenu: [
    //             {
    //                 label: 'Reload',
    //                 accelerator: 'CmdOrCtrl+R',
    //                 click: () => {
    //                     mainWindow.reload();
    //                 }
    //             },
    //             {
    //                 label: 'Toggle Full Screen',
    //                 accelerator: 'F11',
    //                 click: () => {
    //                     mainWindow.setFullScreen(!mainWindow.isFullScreen());
    //                 }
    //             }
    //         ]
    //     },
    // ]);
    //
    // // 애플리케이션에 메뉴 설정
    // Menu.setApplicationMenu(menu);

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