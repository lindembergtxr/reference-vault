import path from 'path'

import * as helpers from '../helpers/index.js'

export const isDev = (): boolean => {
    return process.env.NODE_ENV === 'development'
}

export const getConfigPath = () => {
    return path.join(
        helpers.getUserDataPath(),
        process.env.VITE_DATABASE_CONFIG_FILENAME || 'config.json',
    )
}

export const getPreloadPath = () => {
    return path.join(helpers.getAppPathHelper(), isDev() ? '.' : '..', 'dist-electron/preload.cjs')
}

export const getUIPath = () => {
    return path.join(helpers.getAppPathHelper(), '/dist-react/index.html')
}
