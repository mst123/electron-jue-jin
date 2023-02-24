import { app, BrowserWindow } from "electron";
// 用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  let config = {
    webPreferences: {
      nodeIntegration: true, //把 Node.js 环境集成到渲染进程中
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false, // 在同一个 JavaScript 上下文中使用 Electron API
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };
  mainWindow = new BrowserWindow(config);
  // 打开开发者调试工具
  mainWindow.webContents.openDevTools({ mode: "undocked" });
  // 这里就是打开vue前端页面啦
  mainWindow.loadURL(process.argv[2]);
});