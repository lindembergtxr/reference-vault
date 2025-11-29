import fs from 'fs'
import * as utils from '../utils/index.js'
import { selectFolder } from '../features/filesystem/index.js'

const defaultConfig: ConfigData = {
    theme: 'dark',
    outputDir: null,
}

export let localConfig: ConfigData | null = null

export const writeConfig = async (newConfig: Partial<ConfigData>) => {
    if (!localConfig) {
        await utils.logError({ message: utils.errorMessages['MissingConfig']() })
        throw utils.generateError('MissingConfig')
    }
    localConfig = { ...localConfig, ...newConfig }

    await fs.writeFileSync(utils.getConfigPath(), JSON.stringify(localConfig, null, 2))

    return localConfig
}

export const setupConfig = async () => {
    const configPath = utils.getConfigPath()

    try {
        await fs.promises.access(configPath)
    } catch {
        const data = JSON.stringify(defaultConfig, null, 2)

        await fs.promises.writeFile(configPath, data, 'utf8')
    }
    const raw = await fs.promises.readFile(configPath, 'utf8')

    localConfig = JSON.parse(raw) as ConfigData
}

export const getConfig = async (): Promise<ConfigData> => {
    if (localConfig) return localConfig

    let temp: ConfigData

    const configPath = utils.getConfigPath()

    try {
        const data = await fs.promises.readFile(configPath, 'utf8')

        temp = JSON.parse(data)
    } catch {
        temp = { ...defaultConfig }

        const data = JSON.stringify(temp, null, 2)

        await fs.promises.writeFile(configPath, data, 'utf8')
    }

    localConfig = temp

    return localConfig
}

export const setTheme = async (theme: ConfigData['theme']) => {
    return await writeConfig({ theme })
}

export const setDestinationFolder = async () => {
    const folderPath = await selectFolder()

    const config = await getConfig()

    if (!folderPath) return config

    return await writeConfig({ outputDir: folderPath })
}

export const getDestinationFolder = async (folder: 'images' | 'thumbnails') => {
    const config = await getConfig()

    if (!config.outputDir) return ''

    if (folder === 'images') return config.outputDir

    return `${config.outputDir}/.thumbnails`
}
