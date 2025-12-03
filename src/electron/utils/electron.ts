import { app, dialog, BrowserWindow, ipcMain, WebContents, WebFrameMain } from 'electron'

/*
    This file objective is to centralize all imports involving electron
    to prevent issues with testing, since Vitest test environment does not
    have access to electron, so anything involving imports of electron on files
    being tested tend to cause major issues of things not being recognized. So by
    creating these wrappers and using them instead we can mock these functions instead.
*/

export function getAppPathHelper() {
    try {
        return app.getAppPath()
    } catch (error) {
        console.error('Failed to resolve app path', error)

        throw new Error('Critical failure: cannot resolve app installation path')
    }
}

export function getUserDataPath() {
    try {
        return app.getPath('userData')
    } catch (error) {
        console.error('Failed to resolve userData path', error)

        throw new Error('Critical failure: cannot resolve userData path')
    }
}

export async function showOpenDialog() {
    try {
        return await dialog.showOpenDialog({ properties: ['openDirectory'] })
    } catch (error) {
        console.error('Failed to open dialog', error)
        return { canceled: true, filePaths: [] }
    }
}

export function createBrowserWindow(options: Electron.BrowserWindowConstructorOptions) {
    return new BrowserWindow(options)
}

export function whenElectronAppReady() {
    return app.whenReady()
}

export function handleWrapper(...args: Parameters<Electron.IpcMain['handle']>) {
    return ipcMain.handle(...args)
}

export function onWrapper(...args: Parameters<Electron.IpcMain['on']>) {
    return ipcMain.on(...args)
}

export type WebContentsAux = WebContents

export type WebFrame = WebFrameMain | null
