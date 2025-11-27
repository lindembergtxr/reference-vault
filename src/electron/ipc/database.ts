import { getAllTags } from '../services/tags/database.js'
import { ipcHandle } from '../utils/index.js'

export const registerDatabaseIpc = () => {
    ipcHandle('getAllTags', getAllTags)
}
