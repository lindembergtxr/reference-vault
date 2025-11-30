import { useEffect, useState } from 'react'

import { useTagsContext } from '../components/contexts/tagsCore'
import { useImageListContext } from '../components/contexts/imageListCore'
import { ImageImportDetails } from '../components/images/imageImportDetails'
import { ImageImportEmpty } from '../components/images/imageImportEmpty'
import { useImagePreview } from '../components/images/images.hooks'
import { ImageList } from '../components/images/imageList'

export const ImportPage = () => {
    const [images, setImages] = useState<InternalImage[]>([])

    const { refreshImages } = useImageListContext()
    const { refreshTags } = useTagsContext()

    const { preview, openImage, closePreview, ...previewProps } = useImagePreview({ images })

    const currentIndex = images.findIndex((img) => preview && img.id === preview.id)

    const refreshData = () => window.api.getStagedFiles({}).then((res) => setImages(res))

    const importData = () => window.api.importFiles().then(() => refreshData())

    const onCommit = (image: InternalImage<InternalTagNew>) => {
        window.api.commitImage(image).then((res) => {
            if (res.success) {
                refreshData()
                refreshTags()
                refreshImages()
            } else {
                alert(`Commit failed! - ${JSON.stringify(res.error)}`)
            }
        })
    }

    useEffect(() => {
        refreshData()
    }, [])

    if (images.length === 0) return <ImageImportEmpty importData={importData} />

    if (preview)
        return (
            <ImageImportDetails
                image={preview}
                disableNext={currentIndex === images.length - 1}
                disablePrev={currentIndex === 0}
                {...previewProps}
                onCommit={onCommit}
                closePreview={closePreview}
            />
        )

    return <ImageList images={images} totalCount={images.length} openImage={openImage} />
}
