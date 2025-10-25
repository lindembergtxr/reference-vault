import { importFromFolder } from '../services/files/import.js'
import { getStagedFiles } from '../services/index.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerImageIpc = () => {
    ipcAsyncHandle('importFiles', importFromFolder)

    ipcAsyncHandle('getStagedFiles', getStagedFiles)
}
