import { ipcMain, WebContents, WebFrameMain } from 'electron'
import { pathToFileURL } from 'url'
import { getUIPath, isDev } from './index.js'

export const ipcHandle = <Key extends keyof ApiEventMapping>(
    key: Key,
    handler: () => ApiEventMapping[Key],
) => {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame)
        return handler()
    })
}

export const ipcAsyncHandle = <Key extends keyof ApiEventMapping>(
    key: Key,
    handler: () => Promise<ApiEventMapping[Key]>,
) => {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame)
        return handler()
    })
}

export const ipcWebContentsSend = <Key extends keyof ApiEventMapping>(
    key: Key,
    webContents: WebContents,
    payload: () => ApiEventMapping[Key],
) => {
    webContents.send(key, payload)
}

export const validateEventFrame = (frame: WebFrameMain | null) => {
    if (!frame) {
        throw new Error('Event without sender frame!')
    }

    try {
        const frameUrl = new URL(frame.url)

        if (isDev()) {
            const devHost = `localhost:${process.env.VITE_DEVELOPMENT_PORT}`

            if (frameUrl.host === devHost) return
        }

        const UIFileUrl = pathToFileURL(getUIPath()).toString()

        if (!frame.url.startsWith(UIFileUrl)) {
            throw new Error(`ERROR - Malicious Event! (from ${frame.url})`)
        }
    } catch (error) {
        throw new Error(`Invalid or malicious sender frame! ${error}`)
    }
}
