import { adaptDBImageToInternal } from '../../adapters/images.js'
import { ImageDB } from '../../types/database.js'
import { getTemporaryFiles } from '../images/database.js'

export const getStagedFiles = async () => {
    const dbFiles = (await getTemporaryFiles()) as ImageDB[]

    return dbFiles.map(adaptDBImageToInternal)
}
