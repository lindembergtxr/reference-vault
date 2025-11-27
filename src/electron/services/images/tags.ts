import { execFile } from 'child_process'
import { promisify } from 'util'
import { logError } from '../../utils/errors.js'
import { updateImageTags } from '../tags/database.js'

const execFileAsync = promisify(execFile)

export const writeImageMetadata = async (filepath: string, tags: InternalTag[]) => {
    const organizeTags = (category: TagCategory) =>
        tags
            .filter((t) => t.category === category)
            .map((t) => t.id)
            .join(', ')

    await execFileAsync('exiftool', [
        '-overwrite_original',
        '-overwrite_original',
        `-Keywords=${organizeTags('general')}`,
        `-Artist=${organizeTags('artist')}`,
        `-Character=${organizeTags('character')}`,
        `-Copyright=${organizeTags('copyright')}`,
        `-Meta=${organizeTags('meta')}`,
        filepath,
    ])
}

export const batchAddTagsToImages = async (image: InternalImage) => {
    if (!image.imagePath) return

    await updateImageTags(image)

    try {
        await writeImageMetadata(image.imagePath, image.tags)
    } catch (error) {
        logError({ error, message: 'Database updated, but metadata failed' })
    }
}
