import { MdClose } from 'react-icons/md'

type ImagePreviewProps = {
    image: InternalImage
    closePreview: () => void
}
export const ImagePreview = ({ image, closePreview }: ImagePreviewProps) => {
    if (!image?.imagePath) return null

    return (
        <div className="flex flex-1 items-center justify-center h-full w-full relative">
            <img
                src={`file://${encodeURI(image.imagePath)}`}
                alt={image.imagePath}
                className="w-full h-full object-contain"
            />

            <button className="absolute right-3 top-3" onClick={closePreview}>
                <MdClose size={24} />
            </button>
        </div>
    )
}
