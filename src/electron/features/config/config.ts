import path from 'path'
import { getUserDataPath } from '../../utils/electron.js'
import { getConfig, writeConfig } from './config.services.js'
import { logError } from '../../utils/errors.js'

export function setTheme(theme: ConfigData['theme']) {
    return writeConfig({ theme })
}

export function selectWorkspace(name: string) {
    const normalized = name.trim()

    if (!normalized) {
        throw new Error('Invalid workspace name.')
    }

    const config = getConfig()

    const exists = config.workspaces.some((ws) => ws.name === normalized)

    if (!exists) {
        throw new Error(`Workspace "${normalized}" does not exist.`)
    }

    return writeConfig({ currentWorkspace: normalized })
}

const folderNames = {
    images: 'temp_images',
    thumbnails: 'temp_thumbnails',
    temporary: 'temp',
} as const

export function getTemporaryFolderPath(folder: keyof typeof folderNames) {
    try {
        const userData = getUserDataPath()
        const config = getConfig()

        if (!config.currentWorkspace) throw new Error('Workspace not selected')

        const exists = config.workspaces?.some((ws) => ws.name === config.currentWorkspace)

        if (!exists) throw new Error('Active workspace does not exist')

        return path.join(userData, 'workspaces', config.currentWorkspace, folderNames[folder])
    } catch (error) {
        logError({ message: 'Failed to get temporary folder path', error })

        throw error
    }
}
