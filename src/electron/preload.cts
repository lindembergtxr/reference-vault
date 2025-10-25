const electron = require('electron')

type IpcKey = keyof ApiEventMapping
type IpcData<Key extends IpcKey> = ApiEventMapping[Key]

export const ipcInvoke = <K extends IpcKey>(key: K): Promise<IpcData<K>> => {
    return electron.ipcRenderer.invoke(key)
}

export const ipcOn = <K extends IpcKey>(
    key: K,
    callback: (payload: IpcData<K>) => void,
) => {
    const cb = (_: unknown, payload: IpcData<K>) => callback(payload)

    electron.ipcRenderer.on(key, cb)

    return () => electron.ipcRenderer.off(key, cb)
}

electron.contextBridge.exposeInMainWorld('api', {
    getAllTags: () => ipcInvoke('getAllTags'),
    getConfig: () => ipcInvoke('getConfig'),
    importFiles: () => ipcInvoke('importFiles'),
    getStagedFiles: () => ipcInvoke('getStagedFiles'),
} satisfies Window['api'])
