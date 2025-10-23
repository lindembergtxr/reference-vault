import { app, BrowserWindow } from 'electron'
import dotenv from 'dotenv'

import { getPreloadPath, getUIPath } from './pathResolver.js'
import { ipcHandle, isDev } from './util.js'

dotenv.config()

import './database/index.js'

import { getAllTags } from './services/tags.js'

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
        },
    })

    if (isDev()) {
        mainWindow.loadURL(
            `http://localhost:${process.env.VITE_DEVELOPMENT_PORT}`,
        )
    } else {
        mainWindow.loadFile(getUIPath())
    }

    ipcHandle('getAllTags', () => getAllTags())
})
