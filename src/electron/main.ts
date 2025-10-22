import { app, BrowserWindow } from 'electron'
import dotenv from 'dotenv'

import { getPreloadPath, getUIPath } from './pathResolver.js'
import { isDev } from './util.js'

dotenv.config()

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
})
