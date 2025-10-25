import { ImageCard } from './ImageCard'

type ImageListProps = {
    images: string[]
}
export const ImageList = ({ images }: ImageListProps) => {
    // TODO: turn this data into mutable states
    const size = 'lg'
    const mode = 'open'

    return (
        <div className="flex flex-wrap items-center gap-3">
            {images.map((image) => (
                <ImageCard
                    key={image}
                    size={size}
                    isSelected={false}
                    mode={mode}
                    url={image}
                />
            ))}
        </div>
    )
}
