import { execFile } from 'child_process'
import { promisify } from 'util'

import { logError } from '../../utils/errors.js'

const execFileAsync = promisify(execFile)

type WriteImageMetadataArgs = {
    filepath: string
    tags: InternalTag[]
}
export async function writeImageMetadata({ filepath, tags }: WriteImageMetadataArgs) {
    const organizeTags = (category: TagCategory) => {
        return tags
            .filter((t) => t.category === category)
            .map((t) => t.id)
            .join(', ')
    }
    try {
        await execFileAsync('exiftool', [
            '-overwrite_original',
            `-Keywords=${organizeTags('general')}`,
            `-Artist=${organizeTags('artist')}`,
            `-Character=${organizeTags('character')}`,
            `-Copyright=${organizeTags('copyright')}`,
            `-Meta=${organizeTags('meta')}`,
            filepath,
        ])
    } catch (error) {
        logError({ message: 'Failed to write image metadata', error })
        throw error
    }
}
