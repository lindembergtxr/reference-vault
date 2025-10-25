import path from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as utils from '../../utils/index.js'
import { addThumbnail } from './addThumbnail.js'
import * as getThumbnailTempFolderPath from './getThumbnailTempFolderPath.js'

const test_url = '/fake/userData'

vi.mock('electron', () => ({
    app: {
        getPath: vi.fn(() => test_url),
    },
}))

describe('addThumbnail', () => {
    const fakeSrc = '/fake/path/image.jpg'
    const fakeFolder = '/fake/userData/temp_thumbnails'
    const fakeOutputPath = path.join(fakeFolder, 'image.jpg')

    beforeEach(() => {
        vi.restoreAllMocks()
        vi.resetAllMocks()
    })

    it('creates thumbnail successfully', async () => {
        vi.spyOn(
            getThumbnailTempFolderPath,
            'getThumbnailTempFolderPath',
        ).mockReturnValue(fakeFolder)

        const mkdirMock = vi.spyOn(utils, 'createFolder').mockReturnThis()

        const thumbMock = vi
            .spyOn(utils, 'createThumbOnFolder')
            .mockResolvedValue()

        const result = await addThumbnail(fakeSrc)

        expect(mkdirMock).toHaveBeenCalledWith(fakeFolder)
        expect(thumbMock).toHaveBeenCalledWith(fakeSrc, fakeOutputPath)
        expect(result).toBe(fakeOutputPath)
    })

    it('throws and logs error if createThumbOnFolder fails', async () => {
        const error = new Error('resize failed')

        vi.spyOn(
            getThumbnailTempFolderPath,
            'getThumbnailTempFolderPath',
        ).mockReturnValue(fakeFolder)

        const mkdirMock = vi.spyOn(utils, 'createFolder').mockReturnThis()

        const thumbMock = vi
            .spyOn(utils, 'createThumbOnFolder')
            .mockRejectedValue(error)

        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        await expect(addThumbnail(fakeSrc)).rejects.toThrow(error)

        expect(mkdirMock).toHaveBeenCalledWith(fakeFolder)
        expect(thumbMock).toHaveBeenCalled()

        expect(consoleSpy).toHaveBeenCalledWith(
            `Thumbnail generation failed for ${fakeSrc}:`,
            error,
        )
    })
})
