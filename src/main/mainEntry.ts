import { app, autoUpdater, BrowserWindow } from "electron";
import { CustomScheme } from "./CustomScheme";
import { Updater } from "./Updater";
import { CommonWindowEvent } from "./CommonWindowEvent";
// 用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
app.on("browser-window-created", (e, win) => {
  CommonWindowEvent.regWinEvent(win);
});
let mainWindow: BrowserWindow;
app.whenReady().then(() => {
  let config = {
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
    },
  };

  mainWindow = new BrowserWindow(config);
  // 打开开发者调试工具
  mainWindow.webContents.openDevTools({ mode: "undocked" });
  if (process.argv[2]) {
    // 这里就是打开vue前端页面啦
    mainWindow.loadURL(process.argv[2]);
  } else {
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
    // Updater.check();
  }
  CommonWindowEvent.listen();
  CommonWindowEvent.regWinEvent(mainWindow);
});
