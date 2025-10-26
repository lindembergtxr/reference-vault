import { ipcMain, WebContents, WebFrameMain } from 'electron'
import { pathToFileURL } from 'url'
import { getUIPath, isDev } from './index.js'

export const ipcHandle = <Key extends keyof ApiEventMap>(
    key: Key,
    handler: () => ApiEventMap[Key],
) => {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame)
        return handler()
    })
}

export const ipcAsyncHandle = <Key extends keyof ApiEventMap>(
    key: Key,
    handler: () => Promise<ApiEventMap[Key]>,
) => {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame)
        return handler()
    })
}

export const ipcWebContentsSend = <Key extends keyof ApiEventMap>(
    key: Key,
    webContents: WebContents,
    payload: () => ApiEventMap[Key],
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
