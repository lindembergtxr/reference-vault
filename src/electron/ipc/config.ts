import { initDatabase } from '../database/index.js'
import {
    createWorkspace,
    getConfig,
    selectWorkspace,
    setDestinationFolder,
    setTheme,
} from '../features/config/index.js'
import { copyDatabaseToFolder } from '../features/filesystem/exportDB.js'

import { ipcAsyncHandle, ipcHandle } from './ipc.utils.js'

export const registerConfigIpc = () => {
    ipcHandle('getConfig', getConfig)

    ipcHandle('setTheme', setTheme)

    ipcAsyncHandle('setDestinationFolder', setDestinationFolder)

    ipcHandle('createWorkspace', createWorkspace)

    ipcHandle('selectWorkspace', (name: string) => {
        const config = selectWorkspace(name)
        initDatabase(name)
        return config
    })

    ipcAsyncHandle('exportDB', copyDatabaseToFolder)
}
