import dotenv from 'dotenv'
import * as helpers from './utils/electron.js'

dotenv.config()

import './database/index.js'

import { runSqlMigrations } from './database/migration.js'
import { registerAllIpcs } from './ipc/index.js'
import { getConfig, setupConfig } from './features/config/index.js'
import { getPreloadPath, getUIPath, isDev } from './utils/index.js'
import { initDatabase } from './database/index.js'

helpers.whenElectronAppReady().then(async () => {
    setupConfig()

    const config = getConfig()

    if (!config.currentWorkspace) throw new Error('No workspace selected')

    initDatabase(config.currentWorkspace)

    await runSqlMigrations()

    const mainWindow = helpers.createBrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
            webSecurity: false,
        },
    })

    if (isDev()) {
        const devLocation = `http://localhost:${process.env.VITE_DEVELOPMENT_PORT}`

        mainWindow.webContents.openDevTools()

        mainWindow.loadURL(devLocation)
    } else {
        mainWindow.loadFile(getUIPath())
    }

    registerAllIpcs()
})
