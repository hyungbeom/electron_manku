const { contextBridge, ipcRenderer, Notification  } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openMyAccountWindow: () => ipcRenderer.invoke('open-myaccount-window'),
    openTodoListWindow: () => ipcRenderer.invoke('open-todoList-window'),
    openManageWindow: () => ipcRenderer.invoke('open-manage-window'),
    resizeWindow: (width, height) => ipcRenderer.invoke('resize-window', width, height),
    launchOutlook: (params) => ipcRenderer.send('launch-outlook', params),
    notify: (title, body) => ipcRenderer.send('notify', { title, body }),
    onNotificationClicked: (callback) => ipcRenderer.on('notification-clicked', (event, data) => callback(data)),

});
