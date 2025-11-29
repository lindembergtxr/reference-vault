import { logError } from '../utils/errors.js'

import { ipcHandle } from './ipc.utils.js'

export const registerErrorIpc = () => {
    ipcHandle('logError', logError)
}
