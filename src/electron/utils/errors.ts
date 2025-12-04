import { format } from 'date-fns'
import fs from 'fs'
import path from 'path'

import { getUserDataPath } from './electron.js'
import { createFolder } from './filesystem.js'

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

type LogLevel = 'error' | 'warn' | 'info'

async function writeLog(level: LogLevel, message: string) {
    try {
        const folderPath = createFolder(path.join(getUserDataPath(), 'logs'))

        const now = new Date()

        const fileName = `${format(now, 'yyyy-ww')}-${level}.log`

        const logFile = path.join(folderPath, fileName)

        const timestamp = format(now, 'yyyy-MM-dd HH:mm:ss')

        const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`

        await fs.promises.appendFile(logFile, logLine)
    } catch (err) {
        console.error('Logger failed to write file', err)
    }
}

export type LogArgs = {
    message: string
    error?: unknown
    meta?: Record<string, unknown>
}
export async function logError({ message, error, meta }: LogArgs) {
    let errorMsg = ''

    if (error instanceof Error) errorMsg = error.stack || error.message
    else errorMsg = error ? String(error) : ''

    const metaStr = meta ? ` :: ${JSON.stringify(meta)}` : ''

    const data = `${message}${errorMsg ? ' :: ' + errorMsg : ''}${metaStr}`

    await writeLog('error', data)
}

export async function logInfo({ message, meta }: LogArgs) {
    await writeLog('info', `${message}${meta ? ` :: ${JSON.stringify(meta)}` : ''}`)
}
