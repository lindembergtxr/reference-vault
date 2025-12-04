import fs from 'fs'

import { errorMessages, generateError, getConfigPath, logError } from '../../utils/index.js'
import { defaultConfig } from './config.utils.js'

export let localConfig: ConfigData | null = null

export function getConfig(): ConfigData {
    if (localConfig) return localConfig

    let temp: ConfigData

    const configPath = getConfigPath()

    try {
        const data = fs.readFileSync(configPath, 'utf8')

        temp = JSON.parse(data)
    } catch {
        logError({ message: 'Failed to get config data. Resetting file.' })

        temp = { ...defaultConfig }

        const data = JSON.stringify(temp, null, 2)

        fs.writeFileSync(configPath, data, 'utf8')
    }
    localConfig = temp

    return localConfig
}

export function setupConfig() {
    let raw: string

    const configPath = getConfigPath()

    try {
        raw = fs.readFileSync(configPath, 'utf8')
    } catch {
        // create file if it doesnt exist
        raw = JSON.stringify(defaultConfig, null, 2)

        fs.writeFileSync(configPath, raw, 'utf8')
    }

    try {
        const parsed = JSON.parse(raw)

        // normalizes missing fields
        localConfig = { ...defaultConfig, ...parsed }
    } catch {
        // reset config if existing config is invalid
        localConfig = { ...defaultConfig }

        fs.writeFileSync(configPath, JSON.stringify(localConfig, null, 2), 'utf8')
    }
}

export function writeConfig(newConfig: Partial<ConfigData>) {
    if (!localConfig) {
        logError({ message: errorMessages['MissingConfig']() })

        throw generateError('MissingConfig')
    }
    localConfig = { ...localConfig, ...newConfig }

    fs.writeFileSync(getConfigPath(), JSON.stringify(localConfig, null, 2))

    return localConfig
}
