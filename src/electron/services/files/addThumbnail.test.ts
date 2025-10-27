import path from 'path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as utils from '../../utils/index.js'
import { createThumbnailFromImage } from '../images/thumbnail.js'
import * as getThumbnailTempFolderPath from './getThumbnailTempFolderPath.js'

describe('addThumbnail', () => {
    const fakeSrc = '/fake/path/image.jpg'
    const fakeFolder = '/fake/userData/temp_thumbnails'
    const fakeOutputPath = path.join(fakeFolder, 'image.jpg')

    beforeEach(() => {
        vi.restoreAllMocks()
        vi.resetAllMocks()
    })

    it('creates thumbnail successfully', async () => {
        vi.spyOn(getThumbnailTempFolderPath, 'getThumbnailTempFolderPath').mockReturnValue(
            fakeFolder,
        )

        const mkdirMock = vi.spyOn(utils, 'createFolder').mockReturnThis()

        const thumbMock = vi.spyOn(utils, 'createThumbOnFolder').mockResolvedValue()

        const result = await createThumbnailFromImage(fakeSrc)

        expect(mkdirMock).toHaveBeenCalledWith(fakeFolder)
        expect(thumbMock).toHaveBeenCalledWith(fakeSrc, fakeOutputPath)
        expect(result).toBe(fakeOutputPath)
    })

    it('throws and logs error if createThumbOnFolder fails', async () => {
        const error = utils.generateError('ThumbnailCreationFailed', fakeSrc)

        vi.spyOn(getThumbnailTempFolderPath, 'getThumbnailTempFolderPath').mockReturnValue(
            fakeFolder,
        )

        const mkdirMock = vi.spyOn(utils, 'createFolder').mockReturnThis()

        const thumbMock = vi.spyOn(utils, 'createThumbOnFolder').mockRejectedValue(error)

        await expect(createThumbnailFromImage(fakeSrc)).rejects.toThrow(error)

        expect(mkdirMock).toHaveBeenCalledWith(fakeFolder)
        expect(thumbMock).toHaveBeenCalled()
    })
})
