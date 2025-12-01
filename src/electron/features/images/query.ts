import { logError } from '../../utils/errors.js'
import { adaptDBImageToInternal } from './images.adapters.js'
import {
    countCommittedImages,
    getImages as getImagesService,
    getImagesIdsByTagIds as getImagesIdsByTagIdsService,
} from './images.services.js'
import { ImageDB } from './images.types.js'

export type GetImagesSearchArgs = {
    tagIds?: string[]
}
type GetImagesArgs = GetImagesSearchArgs & {
    situation: InternalImage['situation']
}
export function getImages({ situation, tagIds }: GetImagesArgs): InternalImage[] {
    const dbFiles = getImagesService({ situation, tagIds }) as ImageDB[]

    return dbFiles.map(adaptDBImageToInternal)
}

export function getStagedImages({ tagIds }: GetImagesSearchArgs): InternalImage[] {
    return getImages({ tagIds, situation: 'pending' })
}

export function getCommittedImages({ tagIds }: GetImagesSearchArgs): InternalImage[] {
    return getImages({ tagIds, situation: 'committed' })
}

export function getImagesIdsByTagIds(tagIds: string[]): string[] {
    return getImagesIdsByTagIdsService(tagIds).map(({ id }) => id)
}

export function countImages() {
    try {
        return { success: true, data: countCommittedImages() }
    } catch (error) {
        logError({ message: 'Failed to count images', error })

        return { success: false, error }
    }
}
