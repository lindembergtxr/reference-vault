import { format } from 'date-fns'
import fs from 'fs'
import path from 'path'

import * as helpers from '../helpers/index.js'

type ErrorMessageMap = {
    MissingConfig: () => string
    MissingEnvVar: (name: string) => string
    NoSenderFrame: () => string
    MaliciousEvent: (src: string) => string
    InvalidOrMaliciousSenderFrame: (error: string) => string
    ThumbnailCreationFailed: (src: string) => string
    FailedToMoveFile: () => string
    UnknownErrorWhenMovingFile: () => string
    MigrationError: (name: string) => string
    FailedToImportFile: (url: string) => string
}

export const errorMessages: ErrorMessageMap = {
    MissingConfig: () => 'Config not initialized. Call setupConfig first.',
    NoSenderFrame: () => 'Event without sender frame!',
    MaliciousEvent: (src: string) => `ERROR - Malicious Event! (from ${src})`,
    MissingEnvVar: (name: string) => `Missing required environment variable: ${name}`,
    InvalidOrMaliciousSenderFrame: (error: string) => `Invalid or malicious sender frame! ${error}`,
    ThumbnailCreationFailed: (src: string) => `Thumbnail generation failed for ${src}:`,
    FailedToMoveFile: () => 'Failed to move file.',
    UnknownErrorWhenMovingFile: () => 'Unknown error moving file.',
    MigrationError: (name: string) => `Failed migration: ${name}`,
    FailedToImportFile: (url: string) => `Failed to import ${url}`,
}

export const generateError = <K extends keyof ErrorMessageMap>(
    key: K,
    ...args: Parameters<ErrorMessageMap[K]>
): Error => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = (errorMessages[key] as (...args: any[]) => string)(...args)

    return new Error(message)
}

export type LogError = {
    message: string
    error?: unknown
}
export const logError = async (args: LogError) => {
    const { message, error } = args || { message: 'Invalid properties' }

    const errorLogFolderPath = path.join(helpers.getUserDataPath(), 'error_log')

    // makes sure the folder exists first
    await fs.promises.mkdir(errorLogFolderPath, { recursive: true })

    const now = new Date()

    const fileName = `${format(now, 'yyyy-MM')}.log`

    const logFile = path.join(errorLogFolderPath, fileName)

    // generate timestring in the format yyyy-MM-dd HH:mm:ss
    const timestamp = format(now, 'yyyy-MM-dd HH:mm:ss')

    let errorMsg = ''

    if (error instanceof Error) {
        errorMsg = error.stack || error.message
    } else if (error) {
        errorMsg = String(error)
    }
    const logLine = `[${timestamp}] ${message}${error ? ': ' + errorMsg : ''}\n`

    await fs.promises.appendFile(logFile, logLine)
}
