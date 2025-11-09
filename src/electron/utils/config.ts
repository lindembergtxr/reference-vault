import path from 'path'

import * as helpers from '../helpers/index.js'

export const isDev = (): boolean => {
    return process.env.NODE_ENV === 'development'
}

export const getConfigPath = () => path.join(helpers.getUserDataPath(), 'app_config.json')

export const getPreloadPath = () => {
    return path.join(
        helpers.getAppPathHelper(),
        isDev() ? '.' : '..',
        'dist-electron',
        'preload.cjs'
    )
}

export const getUIPath = () => {
    return path.join(helpers.getAppPathHelper(), '/dist-react', 'index.html')
}
