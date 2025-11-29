import path from 'path'
import { getAppPathHelper, getUserDataPath } from './electron.js'

export const isDev = (): boolean => {
    return process.env.NODE_ENV === 'development'
}

export const getConfigPath = () => path.join(getUserDataPath(), 'app_config.json')

export const getPreloadPath = () => {
    return path.join(getAppPathHelper(), isDev() ? '.' : '..', 'dist-electron', 'preload.cjs')
}

export const getUIPath = () => {
    return path.join(getAppPathHelper(), '/dist-react', 'index.html')
}
