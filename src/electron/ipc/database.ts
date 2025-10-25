import { getAllTags } from '../services/tags.js'
import { ipcHandle } from '../utils/index.js'

export const registerDatabaseIpc = () => {
    ipcHandle('getAllTags', getAllTags)
}
