import { logError } from '../../utils/errors.js'
import { adaptDBImageToInternal } from './images.adapters.js'
import {
    countCommittedImages,
    getImages as getImagesService,
    getImagesIdsByTagIds as getImagesIdsByTagIdsService,
} from './images.services.js'
import { ImageDB } from './images.types.js'

type GetImagesArgs = GetImagesSearchArgs & {
    situation: InternalImage['situation']
}
export function getImages({ situation, include, exclude }: GetImagesArgs): InternalImage[] {
    const dbFiles = getImagesService({ situation, include, exclude }) as ImageDB[]

    return dbFiles.map(adaptDBImageToInternal)
}

export function getStagedImages({ include, exclude }: GetImagesSearchArgs): InternalImage[] {
    return getImages({ include, exclude, situation: 'pending' })
}

export function getCommittedImages({ include, exclude }: GetImagesSearchArgs): InternalImage[] {
    return getImages({ include, exclude, situation: 'committed' })
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
