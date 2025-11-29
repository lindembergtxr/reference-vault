import { getAllTags, createTags } from '../features/tags/index.js'

import { ipcAsyncHandle } from './ipc.utils.js'

export const registerTagsIpc = () => {
    ipcAsyncHandle('getAllTags', getAllTags)

    ipcAsyncHandle('createTags', createTags)
}
