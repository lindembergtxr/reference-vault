import { getAllTags } from '../services/tags/database.js'
import { ipcAsyncHandle } from '../utils/index.js'

export const registerDatabaseIpc = () => {
    ipcAsyncHandle('getAllTags', getAllTags)
}
