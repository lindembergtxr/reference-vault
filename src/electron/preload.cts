const electron = require('electron')

type IpcKey = keyof ApiEventMap
type IpcArgs<Key extends IpcKey> = ApiEventMap[Key]['args']
type IpcData<Key extends IpcKey> = ApiEventMap[Key]['return']

export const ipcInvoke = <K extends IpcKey>(key: K, ...args: IpcArgs<K>): Promise<IpcData<K>> => {
    return electron.ipcRenderer.invoke(key, ...args)
}

export const ipcOn = <K extends IpcKey>(key: K, callback: (payload: IpcData<K>) => void) => {
    const cb = (_: unknown, payload: IpcData<K>) => callback(payload)

    electron.ipcRenderer.on(key, cb)

    return () => electron.ipcRenderer.off(key, cb)
}

electron.contextBridge.exposeInMainWorld('api', {
    getAllTags: () => ipcInvoke('getAllTags'),
    getConfig: () => ipcInvoke('getConfig'),
    setTheme: (theme: ConfigDataTheme) => ipcInvoke('setTheme', theme),
    importFiles: () => ipcInvoke('importFiles'),
    getStagedFiles: () => ipcInvoke('getStagedFiles'),
    logError: (args) => ipcInvoke('logError', args),
    commitImage: (args) => ipcInvoke('commitImage', args),
} satisfies Window['api'])
