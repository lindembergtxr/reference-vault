import path from 'path'
import { describe, expect, it, vi } from 'vitest'

import { getThumbnailTempFolderPath } from './getThumbnailTempFolderPath.js'

describe('getThumbnailTempFolderPath', () => {
    afterEach(() => {
        vi.unstubAllEnvs()
    })

    it('returns the correct default path when env var is not set', () => {
        vi.stubEnv('VITE_IMAGE_STAGING_THUMBNAIL_FOLDER', undefined)

        const result = getThumbnailTempFolderPath()

        expect(result).toBe(path.join('/fake/userData', 'temp_thumbnails'))
    })

    it('respects the env var if defined', () => {
        vi.stubEnv('VITE_IMAGE_STAGING_THUMBNAIL_FOLDER', 'custom_folder')

        const result = getThumbnailTempFolderPath()

        expect(result).toBe(path.join('/fake/userData', 'custom_folder'))
    })
})
