import { ExiftoolProcess } from 'node-exiftool'

import { logError } from '../../utils/errors.js'

const epProcess = new ExiftoolProcess()

type WriteImageMetadataArgs = {
    filepath: string
    tags: InternalTag[]
}
export async function writeImageMetadata({ filepath, tags }: WriteImageMetadataArgs) {
    try {
        await epProcess.open()

        const jsonData = tags
            .map(({ name, category, franchise }) => ({ name, category, franchise }))
            .sort((tagA, tagB) => {
                if (tagA.category < tagB.category) return -1
                if (tagA.category > tagB.category) return 1
                return 0
            })

        const data = { UserComment: JSON.stringify(jsonData) }

        await epProcess.writeMetadata(filepath, data, ['overwrite_original'])

        await epProcess.close()
    } catch (error) {
        logError({ message: 'Failed to write image metadata', error })
        throw error
    }
}
