import { adaptDBImageToInternal } from './images.adapters.js'
import { getImages as getImagesService } from './images.services.js'
import { ImageDB } from './images.types.js'

type GetImagesResponse = Promise<InternalImage[]>
export type GetImagesSearchArgs = {
    tagIds?: string[]
}
type GetImagesArgs = GetImagesSearchArgs & {
    situation: InternalImage['situation']
}
export async function getImages({ situation, tagIds }: GetImagesArgs): GetImagesResponse {
    const dbFiles = (await getImagesService({ situation, tagIds })) as ImageDB[]

    return dbFiles.map(adaptDBImageToInternal)
}

export async function getStagedImages({ tagIds }: GetImagesSearchArgs): GetImagesResponse {
    return await getImages({ tagIds, situation: 'pending' })
}

export async function getCommittedImages({ tagIds }: GetImagesSearchArgs): GetImagesResponse {
    return await getImages({ tagIds, situation: 'committed' })
}
