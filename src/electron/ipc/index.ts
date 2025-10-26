import { registerConfigIpc } from './config.js'
import { registerDatabaseIpc } from './database.js'
import { registerErrorIpc } from './errors.js'
import { registerImageIpc } from './images.js'

export const registerAllIpcs = () => {
    registerDatabaseIpc()
    registerConfigIpc()
    registerImageIpc()
    registerErrorIpc()
}
