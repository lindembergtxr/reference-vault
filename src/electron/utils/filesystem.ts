import { existsSync, mkdirSync } from 'fs'

export function createFolder(directory: string) {
    mkdirSync(directory, { recursive: true })

    if (!existsSync(directory)) throw new Error(`Failed to create folder: ${directory}`)

    return directory
}
