import { getConfig, setDestinationFolder, setTheme } from '../config/index.js'

import { ipcAsyncHandle } from './ipc.utils.js'

export const registerConfigIpc = () => {
    ipcAsyncHandle('getConfig', getConfig)

    ipcAsyncHandle('setTheme', setTheme)

    ipcAsyncHandle('setDestinationFolder', setDestinationFolder)
}
