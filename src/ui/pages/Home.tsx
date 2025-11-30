import { useImageListContext } from '../components/contexts/imageListCore'
import { ImageList } from '../components/images/imageList'
import { ImageListEmpty } from '../components/images/imageListEmpty'
import { ImageListPreview } from '../components/images/imageListPreview'
import { useImagePreview } from '../components/images/images.hooks'

export const HomePage = () => {
    const { images, paginatedImages } = useImageListContext()

    const { preview, openImage, ...previewProps } = useImagePreview({ images })

    const currentIndex = images.findIndex((img) => preview && img.id === preview.id)

    if (images.length === 0) return <ImageListEmpty />

    if (preview) {
        return (
            <ImageListPreview
                preview={preview}
                disableNext={currentIndex === images.length - 1}
                disablePrev={currentIndex === 0}
                {...previewProps}
            />
        )
    }

    return <ImageList images={paginatedImages} totalCount={images.length} openImage={openImage} />
}
