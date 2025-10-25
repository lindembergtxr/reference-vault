import { getConfig } from '../services/config.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerConfigIpc = () => {
    ipcAsyncHandle('getConfig', getConfig)
}
