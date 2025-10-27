import { ImageCard } from './ImageCard'

type ImageListProps = {
    images: InternalImage[]
}
export const ImageList = ({ images }: ImageListProps) => {
    // TODO: turn this data into mutable states
    const size = 'lg'
    const mode = 'open'

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
                        url={image.thumbnailPath!}
                    />
                ))}
        </div>
    )
}
