
//plugins\devPlugin.ts
import { ViteDevServer } from "vite";
export let devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
      });
      server.httpServer.once("listening", () => {
        let { spawn } = require("child_process");
        let addressInfo = server.httpServer.address();
        console.log(addressInfo); // 不知道为什么会出来IPV6的地址
        // let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
        let httpAddress = `http://localhost:${addressInfo.port}`;
        // web页面成功启动，利用子进程开启electron服务
        let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
          // process.cwd() 返回的值就是当前项目的根目录
          cwd: process.cwd(),
          // stdio 用于设置 electron 进程的控制台输出，这里设置 inherit 可以让 electron 子进程的控制台输出数据同步到主进程的控制台。
          stdio: "inherit",
        });
        // 当 electron 子进程退出的时候，我们要关闭 Vite 的 http 服务，并且控制父进程退出，准备下一次启动
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};
// getReplacer 方法是我们为 vite-plugin-optimizer 插件提供的内置模块列表
export let getReplacer = () => {
  let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  result["electron"] = () => {
    let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};