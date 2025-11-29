import {
    getStagedImages,
    getCommittedImages,
    importFromFolder,
    commitImage,
} from '../features/images/index.js'

import { ipcAsyncHandle } from './ipc.utils.js'

export const registerImageIpc = () => {
    ipcAsyncHandle('importFiles', importFromFolder)

    ipcAsyncHandle('getStagedFiles', getStagedImages)

    ipcAsyncHandle('getImageFiles', getCommittedImages)

    ipcAsyncHandle('commitImage', commitImage)
}
