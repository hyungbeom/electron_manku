const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    send: (channel, data) => {
        // 허용된 채널 목록
        const validChannels = ['login-success', 'minimize-app', 'maximize-app', 'close-app'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },

});

