import { logError } from '../../utils/errors.js'
import { adaptDBImageToInternal } from './images.adapters.js'
import {
    countCommittedImages,
    getImages as getImagesService,
    getImagesIdsByTagIds as getImagesIdsByTagIdsService,
    getAllImagesWithDuplicateTags,
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
    try {
        if (include?.length === 0)
            throw new Error('There needs to have at least one array included!')

        return getImages({ include, exclude, situation: 'pending' })
    } catch (error) {
        logError({ message: 'Failed to get images', error })
        return []
    }
}

export function getCommittedImages({ include, exclude }: GetImagesSearchArgs): InternalImage[] {
    try {
        if (include?.length === 0)
            throw new Error('There needs to have at least one array included!')

        return getImages({ include, exclude, situation: 'committed' })
    } catch (error) {
        logError({ message: 'Failed to get images', error })
        return []
    }
}

export function getDuplicateImages(): InternalImage[] {
    try {
        return getAllImagesWithDuplicateTags().map(adaptDBImageToInternal)
    } catch (error) {
        logError({ message: 'Failed to get duplicate images', error })
        return []
    }
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
