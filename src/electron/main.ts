import dotenv from 'dotenv'
import { app, BrowserWindow } from 'electron'

import { getPreloadPath, getUIPath } from './pathResolver.js'
import { ipcAsyncHandle, ipcHandle, isDev } from './util.js'

dotenv.config()

import './database/index.js'

import { runSqlMigrations } from './database/migration.js'
import { getConfig, setupConfig } from './services/config.js'
import { importFromFolder } from './services/files/import.js'
import { getStagedFiles } from './services/index.js'
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

    setupConfig()

    ipcHandle('getAllTags', () => getAllTags())

    ipcAsyncHandle('getConfig', () => getConfig())

    ipcAsyncHandle('importFiles', () => importFromFolder())

    ipcAsyncHandle('getStagedFiles', () => getStagedFiles())
})
