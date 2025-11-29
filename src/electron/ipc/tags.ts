import { addTags } from '../features/tags/create.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerTagsIpc = () => {
    ipcAsyncHandle('createTags', addTags)
}
