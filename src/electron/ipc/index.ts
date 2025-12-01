import { registerConfigIpc } from './config.js'
import { registerErrorIpc } from './errors.js'
import { registerImageIpc } from './images.js'
import { registerReportIpc } from './report.js'
import { registerTagsIpc } from './tags.js'

export function registerAllIpcs() {
    registerConfigIpc()
    registerImageIpc()
    registerErrorIpc()
    registerTagsIpc()
    registerReportIpc()
}
