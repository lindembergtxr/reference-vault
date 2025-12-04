import { logError } from '../../utils/errors.js'
import { selectFolder } from '../filesystem/filesystem.utils.js'
import { getConfig, writeConfig } from './config.services.js'

import { defaultWorkspace } from './config.utils.js'

export function createWorkspace(name: string) {
    try {
        const config = getConfig()
        const workspace = { ...defaultWorkspace, name: name.trim() || 'DEFAULT' }

        if (config.workspaces.some((ws) => ws.name === workspace.name)) {
            throw new Error('Workspace name already exists!')
        } else {
            config.workspaces.push(workspace)

            return writeConfig(config)
        }
    } catch (error) {
        logError({ message: 'Failed to create workspace.', error })

        throw error
    }
}

export async function setDestinationFolder(name: string): Promise<ConfigData> {
    try {
        const config = getConfig()

        const folderPath = await selectFolder()

        if (!folderPath) return config

        const index = config.workspaces.findIndex((ws) => ws.name === name)

        if (index === -1) throw new Error('Workspace not found!')

        config.workspaces[index] = {
            ...config.workspaces[index],
            outputDir: folderPath,
        }

        return writeConfig(config)
    } catch (error) {
        logError({ message: 'Failed to set destination folder.', error })
        throw error
    }
}

const destinationFolder = {
    images: (folderPath: string) => folderPath,
    thumbnails: (folderPath: string) => `${folderPath}/.thumbnails`,
}

export function getDestinationFolder(folder: 'images' | 'thumbnails'): string {
    try {
        const config = getConfig()

        const workspaceName = config.currentWorkspace

        if (!workspaceName) throw new Error('No active workspace selected.')

        const workspace = config.workspaces.find((ws) => ws.name === workspaceName)

        if (!workspace) throw new Error('Active workspace not found.')

        if (!workspace.outputDir) throw new Error('Current workspace has no destination folder.')

        return destinationFolder[folder](workspace.outputDir)
    } catch (error) {
        logError({ message: 'Failed to get destination folder', error })

        throw error
    }
}
