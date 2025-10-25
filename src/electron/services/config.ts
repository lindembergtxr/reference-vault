import fs from 'fs'
import { getConfigPath } from '../utils/index.js'

const defaultConfig: ConfigData = {
    theme: 'dark',
    outputDir: null,
    thumbnailOutputDir: null,
    lastOpenedFolder: null,
}

export let localConfig: ConfigData | null = null

export const writeConfig = (newConfig: Partial<ConfigData>) => {
    if (!localConfig)
        throw new Error('Config not initialized. Call setupConfig first.')

    localConfig = { ...localConfig, ...newConfig }

    fs.writeFileSync(getConfigPath(), JSON.stringify(localConfig, null, 2))
}

export const setupConfig = async () => {
    const configPath = getConfigPath()

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

    const configPath = getConfigPath()

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
