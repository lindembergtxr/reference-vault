import { getAllTags, createTags } from '../features/tags/index.js'
import { removeTags, updateTag } from '../features/tags/operations.js'

import { ipcAsyncHandle } from './ipc.utils.js'

export const registerTagsIpc = () => {
    ipcAsyncHandle('getAllTags', getAllTags)

    ipcAsyncHandle('createTags', createTags)

    ipcAsyncHandle('removeTags', removeTags)

    ipcAsyncHandle('updateTag', updateTag)
}
