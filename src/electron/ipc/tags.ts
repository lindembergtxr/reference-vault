import { addTags } from '../services/tags/create.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerTagsIpc = () => {
    ipcAsyncHandle('createTags', addTags)
}
