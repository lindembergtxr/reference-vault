import { getAllTags } from '../features/tags/tags.services.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerDatabaseIpc = () => {
    ipcAsyncHandle('getAllTags', getAllTags)
}
