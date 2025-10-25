import dotenv from 'dotenv'
import { app, BrowserWindow } from 'electron'

dotenv.config()

import './database/index.js'

import { runSqlMigrations } from './database/migration.js'
import { registerAllIpcs } from './ipc/index.js'
import { setupConfig } from './services/config.js'
import { getPreloadPath, getUIPath, isDev } from './utils/index.js'

app.whenReady().then(async () => {
    await runSqlMigrations()

    const mainWindow = new BrowserWindow({
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

    setupConfig()

    registerAllIpcs()
})
