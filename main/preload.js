const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openMyAccountWindow: () => ipcRenderer.invoke('open-myaccount-window'),
    openTodoListWindow: () => ipcRenderer.invoke('open-todoList-window'),
    openManageWindow: () => ipcRenderer.invoke('open-manage-window'),
    resizeWindow: (width, height) => ipcRenderer.invoke('resize-window', width, height),
    launchOutlook: (params) => ipcRenderer.send('launch-outlook', params)
});
