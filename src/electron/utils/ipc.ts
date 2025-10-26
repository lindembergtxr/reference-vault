import { pathToFileURL } from 'url'
import * as utils from './index.js'
import * as helpers from '../helpers/electron.js'

export const ipcHandle = <Key extends keyof ApiEventMap>(
    key: Key,
    handler: (...args: ApiEventMap[Key]['args']) => ApiEventMap[Key]['return'],
) => {
    helpers.handleWrapper(key, async (event, ...args: ApiEventMap[Key]['args']) => {
        await validateEventFrame(event.senderFrame)
        return handler(...args)
    })
}

export const ipcAsyncHandle = <Key extends keyof ApiEventMap>(
    key: Key,
    handler: (...args: ApiEventMap[Key]['args']) => Promise<ApiEventMap[Key]['return']>,
) => {
    helpers.handleWrapper(key, async (event, ...args: ApiEventMap[Key]['args']) => {
        await validateEventFrame(event.senderFrame)
        return handler(...args)
    })
}

export const ipcWebContentsSend = <Key extends keyof ApiEventMap>(
    key: Key,
    webContents: helpers.WebContentsAux,
    payload: (...args: ApiEventMap[Key]['args']) => ApiEventMap[Key]['return'],
) => {
    webContents.send(key, payload)
}

export const validateEventFrame = async (frame: helpers.WebFrame) => {
    if (!frame) {
        await utils.logError({ message: utils.errorMessages['NoSenderFrame']() })
        throw utils.generateError('NoSenderFrame')
    }

    try {
        const frameUrl = new URL(frame.url)

        if (utils.isDev()) {
            const devHost = `localhost:${process.env.VITE_DEVELOPMENT_PORT}`

            if (frameUrl.host === devHost) return
        }

        const UIFileUrl = pathToFileURL(utils.getUIPath()).toString()

        if (!frame.url.startsWith(UIFileUrl)) {
            await utils.logError({ message: 'Malicious Event!' })
            throw utils.generateError('MaliciousEvent', frame.url)
        }
    } catch (error) {
        await utils.logError({ message: 'Invalid or malicious sender frame!' })
        throw utils.generateError('InvalidOrMaliciousSenderFrame', `${error}`)
    }
}
