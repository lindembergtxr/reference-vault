import { app } from 'electron'
import path from 'path'

export const isDev = (): boolean => {
    return process.env.NODE_ENV === 'development'
}

export const getConfigPath = () => {
    return path.join(
        app.getPath('userData'),
        process.env.VITE_DATABASE_CONFIG_FILENAME || 'config.json',
    )
}

export const getPreloadPath = () => {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        'dist-electron/preload.cjs',
    )
}

export const getUIPath = () => {
    return path.join(app.getAppPath(), '/dist-react/index.html')
}
