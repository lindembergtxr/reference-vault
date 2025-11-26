import { imageSizeFromFile } from 'image-size/fromFile'

import { adaptDBImageToInternal } from '../../adapters/images.js'
import { ImageDB } from '../../types/database.js'
import { getCommitedFiles, getTemporaryFiles } from './database.js'

export const getStagedFiles = async () => {
    const dbFiles = (await getTemporaryFiles()) as ImageDB[]

    return dbFiles.map(adaptDBImageToInternal)
}

export const getImageFiles = async () => {
    const dbFiles = (await getCommitedFiles()) as ImageDB[]

    const enriched = await Promise.all(
        dbFiles.map(async (file) => {
            const { width, height } = await imageSizeFromFile(file.thumbnail_path ?? '')
            const aspectRatio = width && height ? width / height : null

            return { ...file, width, height, aspectRatio }
        })
    )

    return enriched.map(adaptDBImageToInternal)
}
