import { app, dialog, BrowserWindow, ipcMain, WebContents, WebFrameMain } from 'electron'

/*
    This file objective is to centralize all imports involving electron
    to prevent issues with testing, since Vitest test environment does not
    have access to electron, so anything involving imports of electron on files
    being tested tend to cause major issues of things not being recognized. So by
    creating these wrappers and using them instead we can mock these functions instead.
*/

export const getAppPathHelper = () => app.getAppPath()

export const getUserDataPath = () => app.getPath('userData')

export const showOpenDialog = () => {
    return dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
}

export const createBrowserWindow = (options: Electron.BrowserWindowConstructorOptions) => {
    return new BrowserWindow(options)
}

export const whenElectronAppReady = () => {
    return app.whenReady()
}

export const handleWrapper = (...args: Parameters<Electron.IpcMain['handle']>) => {
    return ipcMain.handle(...args)
}

export const onWrapper = (...args: Parameters<Electron.IpcMain['on']>) => {
    return ipcMain.on(...args)
}

export type WebContentsAux = WebContents

export type WebFrame = WebFrameMain | null
