import { generateHealthReport } from '../features/images/report.js'

import { ipcAsyncHandle } from './ipc.utils.js'

export const registerReportIpc = () => {
    ipcAsyncHandle('generateHealthReport', generateHealthReport)
}
