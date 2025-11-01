import { getConfig, setTheme } from '../services/config.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerConfigIpc = () => {
    ipcAsyncHandle('getConfig', getConfig)

    ipcAsyncHandle('setTheme', setTheme)
}
