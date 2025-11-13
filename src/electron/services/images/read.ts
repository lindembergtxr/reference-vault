import { adaptDBImageToInternal } from '../../adapters/images.js'
import { ImageDB } from '../../types/database.js'
import { getCommitedFiles, getTemporaryFiles } from './database.js'

export const getStagedFiles = async () => {
    const dbFiles = (await getTemporaryFiles()) as ImageDB[]

    return dbFiles.map(adaptDBImageToInternal)
}

export const getImageFiles = async () => {
    const dbFiles = (await getCommitedFiles()) as ImageDB[]

    return dbFiles.map(adaptDBImageToInternal)
}
