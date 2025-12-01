import fs from 'fs'

import * as utils from '../utils/index.js'
import { selectFolder } from '../features/filesystem/index.js'

const defaultConfig: ConfigData = {
    theme: 'dark',
    outputDir: null,
}

export let localConfig: ConfigData | null = null

export function writeConfig(newConfig: Partial<ConfigData>) {
    if (!localConfig) {
        utils.logError({ message: utils.errorMessages['MissingConfig']() })

        throw utils.generateError('MissingConfig')
    }
    localConfig = { ...localConfig, ...newConfig }

    fs.writeFileSync(utils.getConfigPath(), JSON.stringify(localConfig, null, 2))

    return localConfig
}

export function setupConfig() {
    const configPath = utils.getConfigPath()

    try {
        fs.accessSync(configPath)
    } catch {
        const data = JSON.stringify(defaultConfig, null, 2)

        fs.writeFileSync(configPath, data, 'utf8')
    }
    const raw = fs.readFileSync(configPath, 'utf8')

    localConfig = JSON.parse(raw) as ConfigData
}

export function getConfig(): ConfigData {
    if (localConfig) return localConfig

    let temp: ConfigData

    const configPath = utils.getConfigPath()

    try {
        const data = fs.readFileSync(configPath, 'utf8')

        temp = JSON.parse(data)
    } catch {
        temp = { ...defaultConfig }

        const data = JSON.stringify(temp, null, 2)

        fs.writeFileSync(configPath, data, 'utf8')
    }
    localConfig = temp

    return localConfig
}

export function setTheme(theme: ConfigData['theme']) {
    return writeConfig({ theme })
}

export async function setDestinationFolder() {
    const config = getConfig()

    const folderPath = await selectFolder()

    if (!folderPath) return config

    return writeConfig({ outputDir: folderPath })
}

export function getDestinationFolder(folder: 'images' | 'thumbnails') {
    const config = getConfig()

    if (!config.outputDir) return ''

    if (folder === 'images') return config.outputDir

    return `${config.outputDir}/.thumbnails`
}
