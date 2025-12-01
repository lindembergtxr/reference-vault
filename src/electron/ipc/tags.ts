import { getAllTags, createTags } from '../features/tags/index.js'
import { removeTags, updateTag } from '../features/tags/operations.js'

import { ipcAsyncHandle, ipcHandle } from './ipc.utils.js'

export const registerTagsIpc = () => {
    ipcHandle('getAllTags', getAllTags)

    ipcHandle('createTags', createTags)

    ipcAsyncHandle('removeTags', removeTags)

    ipcAsyncHandle('updateTag', updateTag)
}
