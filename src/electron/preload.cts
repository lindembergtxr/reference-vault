const electron = require("electron");

electron.contextBridge.exposeInMainWorld("api", {
  ping: () => "pong",
} satisfies Window["api"]);

function ipcInvoke<Key extends keyof ApiEventMapping>(
  key: Key
): Promise<ApiEventMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof ApiEventMapping>(
  key: Key,
  callback: (payload: ApiEventMapping[Key]) => void
) {
  const cb = (_: any, payload: ApiEventMapping[Key]) => callback(payload);

  electron.ipcRenderer.on(key, cb);

  return () => electron.ipcRenderer.off(key, cb);
}
