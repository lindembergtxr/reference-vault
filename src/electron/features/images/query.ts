import { adaptDBImageToInternal } from './images.adapters.js'
import { getImages as getImagesService } from './images.services.js'
import { ImageDB } from './images.types.js'

type GetImagesArgs = {
    situation: InternalImage['situation']
}
export async function getImages({ situation }: GetImagesArgs): Promise<InternalImage[]> {
    const dbFiles = (await getImagesService({ situation })) as ImageDB[]

    return dbFiles.map(adaptDBImageToInternal)
}

export async function getStagedImages(): Promise<InternalImage[]> {
    return await getImages({ situation: 'pending' })
}

export async function getCommittedImages(): Promise<InternalImage[]> {
    return await getImages({ situation: 'committed' })
}
