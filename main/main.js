import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ electron-updater 동적 import (ESM 환경 대응)
let autoUpdater;
app.whenReady().then(async () => {
    const updaterModule = await import('electron-updater');
    autoUpdater = updaterModule.autoUpdater;

    // ✅ 앱이 패키징된 상태에서만 업데이트 체크 실행
    if (app.isPackaged) {
        checkForUpdates();
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow; // 전체화면 전환을 위한 윈도우 변수

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 868,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL('https://manku.progist.co.kr');
    mainWindow.setMenu(null);
}

// ✅ Electron이 준비된 후 실행
app.whenReady().then(() => {
    createWindow();
});

// ✅ 업데이트 체크 함수
function checkForUpdates() {
    if (!autoUpdater) return;

    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => {
        console.log('업데이트 확인 중...');
    });

    autoUpdater.on('update-available', () => {
        console.log('새로운 업데이트가 있습니다.');
        dialog.showMessageBox({
            type: 'info',
            title: '업데이트',
            message: '새로운 버전이 있습니다. 다운로드를 시작합니다.',
        });
    });

    autoUpdater.on('update-not-available', () => {
        console.log('새로운 업데이트가 없습니다.');
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let { percent, transferred, total } = progressObj;
        console.log(`다운로드 진행률: ${percent}% (${transferred} / ${total} bytes)`);

        // 다운로드 진행 상황을 유저에게 보여줍니다.
        dialog.showMessageBox({
            type: 'info',
            title: '업데이트 다운로드',
            message: `다운로드 진행률: ${percent.toFixed(2)}%`,
        });
    });

    autoUpdater.on('update-downloaded', () => {
        console.log('다운로드 완료, 설치 준비 중...');
        dialog.showMessageBox({
            type: 'info',
            title: '업데이트 완료',
            message: '업데이트가 다운로드되었습니다. 이제 앱을 재시작하여 설치할 수 있습니다.',
            buttons: ['재시작', '나중에']
        }).then(response => {
            if (response.response === 0) { // '재시작' 버튼을 눌렀을 때
                autoUpdater.quitAndInstall(); // 설치하고 앱을 재시작
            }
        });
    });

    autoUpdater.on('error', (err) => {
        console.error('업데이트 오류:', err);
        dialog.showMessageBox({
            type: 'error',
            title: '업데이트 실패',
            message: `업데이트 도중 오류가 발생했습니다: ${err.message}`,
        });
    });
}

// ✅ 앱 종료 및 창 관리
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

// ✅ IPC 이벤트 핸들러
ipcMain.on('close-app', () => app.quit());
ipcMain.on('minimize-app', () => mainWindow?.minimize());
ipcMain.on('maximize-app', () => mainWindow?.maximize());
ipcMain.on('login-success', () => mainWindow?.setFullScreen(true));

