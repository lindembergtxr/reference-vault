import dotenv from 'dotenv'
import { app, BrowserWindow } from 'electron'

import { getPreloadPath, getUIPath } from './pathResolver.js'
import { ipcHandle, isDev } from './util.js'

dotenv.config()

import './database/index.js'

import { runSqlMigrations } from './database/migration.js'
import { getAllTags } from './services/tags.js'

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
        mainWindow.webContents.openDevTools()

        mainWindow.loadURL(
            `http://localhost:${process.env.VITE_DEVELOPMENT_PORT}`,
        )
    } else {
        mainWindow.loadFile(getUIPath())
    }

    ipcHandle('getAllTags', () => getAllTags())
})
