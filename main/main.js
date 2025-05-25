import { app, BrowserWindow, ipcMain, Menu, dialog, Tray, Notification } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import * as regedit from "regedit";
import {execFile} from "node:child_process";

// ✅ electron-updater 동적 import (ESM 환경 대응)
let autoUpdater;
app.setAppUserModelId('MANKU_ERP');
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
let tray
let outlookPath = null;

function findOutlookPath() {
    regedit.list('HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\OUTLOOK.EXE', (err, result) => {
        if (err) {
            console.error('레지스트리 조회 실패');
            return;
        }
        outlookPath = result['HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\OUTLOOK.EXE'].values[''].value;

    });
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        title : 'MANKU ERP',
        width: 1366,
        height: 868,
        icon : path.join(__dirname, 'main.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // mainWindow.loadURL('https://manku.progist.co.kr'); // Next.js dev server
    mainWindow.loadURL('http://localhost:3000'); // Next.js dev server
    mainWindow.setMenu(null);
    mainWindow.webContents.openDevTools();

    // ✅ 여기가 중요: app.whenReady() 안에서 Tray 생성
    tray = new Tray(path.join(__dirname, 'main.ico'));
    const contextMenu = Menu.buildFromTemplate([
        { label: '열기', click: () => mainWindow.show() },
        { label: '종료', click: () => app.quit() },
    ]);

    tray.setToolTip('MANKU ERP');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.show();
    });
    // ✅ X 버튼 눌렀을 때 종료 대신 숨김
    mainWindow.on('close', (event) => {
        event.preventDefault(); // 기본 종료 막기
        mainWindow.hide(); // 창만 숨김
    });
    findOutlookPath();
});



// 전역으로 추적할 창 변수들
let myAccountWindow = null;
let todoListWindow = null;
let manageWindow = null;

// 👉 마이계정 창
ipcMain.handle('open-myaccount-window', () => {
    if (myAccountWindow && !myAccountWindow.isDestroyed()) {
        if (myAccountWindow.isMinimized()) myAccountWindow.restore();
        myAccountWindow.focus();
        return;
    }

    myAccountWindow = new BrowserWindow({
        title : '개인정보수정',
        icon : path.join(__dirname, 'main.ico'),
        width: 600,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    myAccountWindow.loadURL('http://localhost:3000/myaccount');

    myAccountWindow.on('closed', () => {
        myAccountWindow = null;
    });
});

// 👉 투두리스트 창
ipcMain.handle('open-todoList-window', () => {
    if (todoListWindow && !todoListWindow.isDestroyed()) {
        if (todoListWindow.isMinimized()) todoListWindow.restore();
        todoListWindow.focus();
        return;
    }

    todoListWindow = new BrowserWindow({
        title : 'TODO-LIST',
        icon : path.join(__dirname, 'main.ico'),
        width: 600,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    todoListWindow.loadURL('http://localhost:3000/todoList');

    todoListWindow.on('closed', () => {
        todoListWindow = null;
    });
});

// 👉 관리 창
ipcMain.handle('open-manage-window', () => {
    if (manageWindow && !manageWindow.isDestroyed()) {
        if (manageWindow.isMinimized()) manageWindow.restore();
        manageWindow.focus();
        return;
    }

    manageWindow = new BrowserWindow({
        title : '히스토리',
        icon : path.join(__dirname, 'main.ico'),
        width: 1366,
        height: 868,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    manageWindow.loadURL('http://localhost:3000/manage');

    manageWindow.on('closed', () => {
        manageWindow = null;
    });
});

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

app.on('before-quit', () => {
    tray.destroy();
});


ipcMain.handle('resize-window', (event, width, height) => {
    if (mainWindow) {
        mainWindow.setSize(width, height);
    }
});


ipcMain.on('notify', (event, { title, body }) => {
    const notification = new Notification({ title, body,  icon : path.join(__dirname, 'main.ico') });
    notification.on('click', () => {
        // 알림 클릭 시, 렌더러로 메시지 보내기
        const win = BrowserWindow.getAllWindows()[0]; // 메인 윈도우 가져오기
        if (win) {
            win.webContents.send('notification-clicked', { title, body });
        }
    });
    notification.show();
});
// 👇 버튼 클릭 시 Outlook 실행
ipcMain.on('launch-outlook', (event, params) => {
    if (outlookPath) {
        const {to, subject, body, cc} = params;
        // const to = 'recipient@example.com'; // 받는 사람
        // const cc = 'cc1@example.com;cc2@example.com'; // 참조 (세미콜론으로 구분)
        // const subject = '메일 제목'; // 제목
        // const body = '메일 본문 내용'; // 본문 내용

        // mailto 링크 형식으로 이메일 주소와 내용을 자동으로 채우기
        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(cc)}`;

        // execFile에서 Outlook 경로와 인자를 별도로 전달
        execFile(outlookPath, ['/c', 'ipm.note', '/m', mailtoLink], (error) => {
            if (error) {
                console.log('Outlook 실행 실패====> 문의바람');
            } else {
                console.log('Outlook 실행됨!');
            }
        });
    } else {
        console.log('Outlook 실행 실패====> Outlook 경로를 찾지 못함');
    }
});