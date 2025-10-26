import { ipcHandle, logError } from '../utils/index.js'

export const registerErrorIpc = () => {
    ipcHandle('logError', logError)
}
