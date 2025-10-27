import { ImageCard } from './ImageCard'
import { useImageListContext } from '../contexts/imageList'

export type ImageListSize = 'sm' | 'md' | 'lg'

export const ImageList = () => {
    // TODO: turn this data into mutable states
    const size = 'lg'
    const mode = 'open'

    const { images, openImage } = useImageListContext()

    const selectImage = () => {}

    return (
        <div className="flex flex-wrap items-center gap-3">
            {images
                .filter((images) => images && images.thumbnailPath != null)
                .map((image) => (
                    <ImageCard
                        key={image.id}
                        size={size}
                        isSelected={false}
                        mode={mode}
                        imageId={image.id}
                        url={image.thumbnailPath!}
                        onOpen={openImage}
                        onSelect={selectImage}
                    />
                ))}
        </div>
    )
}
