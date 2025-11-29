import path from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as utils from '../../utils/index.js'
import * as filesystem from '../filesystem/index.js'

import { createThumbnailFromImage } from './thumbnail.js'

describe('addThumbnail', () => {
    const fakeSrc = '/fake/path/image.jpg'
    const fakeFolder = '/fake/userData/temp_thumbnails'
    const fakeOutputPath = path.join(fakeFolder, 'image.jpg')

    beforeEach(() => {
        vi.resetAllMocks()
        vi.restoreAllMocks()
    })

    it('creates thumbnail successfully', async () => {
        vi.spyOn(filesystem, 'getTemporaryFolderPath').mockReturnValue(fakeFolder)

        const mkdirMock = vi.spyOn(filesystem, 'createFolder').mockResolvedValue()

        const thumbMock = vi.spyOn(filesystem, 'createThumbnailOnFolder').mockResolvedValue()

        const result = await createThumbnailFromImage({ url: fakeSrc, outputDir: fakeFolder })

        expect(mkdirMock).toHaveBeenCalledWith(fakeFolder)
        expect(thumbMock).toHaveBeenCalledWith(fakeSrc, fakeOutputPath)
        expect(result).toBe(fakeOutputPath)
    })

    it('throws and logs error if createThumbOnFolder fails', async () => {
        const error = utils.generateError('ThumbnailCreationFailed', fakeSrc)

        vi.spyOn(filesystem, 'getTemporaryFolderPath').mockReturnValue(fakeFolder)

        const mkdirMock = vi.spyOn(filesystem, 'createFolder').mockReturnThis()

        const thumbMock = vi.spyOn(filesystem, 'createThumbnailOnFolder').mockRejectedValue(error)

        const logErrorMock = vi.spyOn(utils, 'logError').mockReturnThis()

        const generateErrorMock = vi.spyOn(utils, 'generateError').mockReturnValue(error)

        await expect(
            createThumbnailFromImage({ url: fakeSrc, outputDir: fakeFolder })
        ).rejects.toThrow(error)

        expect(mkdirMock).toHaveBeenCalledWith(fakeFolder)
        expect(logErrorMock).toHaveBeenCalled()
        expect(generateErrorMock).toHaveBeenCalled()
        expect(thumbMock).toHaveBeenCalled()
    })
})
