import { importFromFolder } from '../services/files/import.js'
import { commitImage } from '../services/images/commit.js'
import { getImageFiles, getStagedFiles } from '../services/index.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerImageIpc = () => {
    ipcAsyncHandle('importFiles', importFromFolder)

    ipcAsyncHandle('getStagedFiles', getStagedFiles)

    ipcAsyncHandle('getImageFiles', getImageFiles)

    ipcAsyncHandle('commitImage', commitImage)
}
