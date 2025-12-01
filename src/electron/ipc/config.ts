import { getConfig, setDestinationFolder, setTheme } from '../config/index.js'
import { copyDatabaseToFolder } from '../features/filesystem/exportDB.js'

import { ipcAsyncHandle, ipcHandle } from './ipc.utils.js'

export const registerConfigIpc = () => {
    ipcHandle('getConfig', getConfig)

    ipcHandle('setTheme', setTheme)

    ipcAsyncHandle('setDestinationFolder', setDestinationFolder)

    ipcAsyncHandle('exportDB', copyDatabaseToFolder)
}
