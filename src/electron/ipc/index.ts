import { registerConfigIpc } from './config.js'
import { registerDatabaseIpc } from './database.js'
import { registerErrorIpc } from './errors.js'
import { registerImageIpc } from './images.js'
import { registerTagsIpc } from './tags.js'

export const registerAllIpcs = () => {
    registerDatabaseIpc()
    registerConfigIpc()
    registerImageIpc()
    registerErrorIpc()
    registerTagsIpc()
}
