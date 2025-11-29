import { importFromFolder } from '../features/images/import.js'
import { commitImage } from '../features/images/write.js'
import { getStagedImages, getCommittedImages } from '../features/images/index.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerImageIpc = () => {
    ipcAsyncHandle('importFiles', importFromFolder)

    ipcAsyncHandle('getStagedFiles', getStagedImages)

    ipcAsyncHandle('getImageFiles', getCommittedImages)

    ipcAsyncHandle('commitImage', commitImage)
}
