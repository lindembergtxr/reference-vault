import {
    getStagedImages,
    getCommittedImages,
    importFromFolder,
    commitImage,
    addTagsToImage,
    removeTagsFromImage,
    removeImage,
    countImages,
    getDuplicateImages,
} from '../features/images/index.js'

import { ipcAsyncHandle, ipcHandle } from './ipc.utils.js'

export const registerImageIpc = () => {
    ipcAsyncHandle('importFiles', importFromFolder)

    ipcHandle('getStagedFiles', getStagedImages)

    ipcHandle('getImageFiles', getCommittedImages)

    ipcAsyncHandle('commitImage', commitImage)

    ipcAsyncHandle('addTagsToImage', addTagsToImage)

    ipcAsyncHandle('removeTagsFromImage', removeTagsFromImage)

    ipcAsyncHandle('deleteImage', removeImage)

    ipcHandle('countImages', countImages)

    ipcHandle('getDuplicateImages', getDuplicateImages)
}
