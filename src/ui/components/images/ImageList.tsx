import { cn } from '../../utils'

type ImageListProps = {
    images: InternalImage[]
    openImage: (imageId: string) => void
}
export const ImageList = ({ images, openImage }: ImageListProps) => {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-4 py-10 h-full overflow-y-auto">
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {images.map((image) => (
                        <button
                            key={image.id}
                            className={cn(
                                'relative aspect-square flex items-center justify-center bg-gray-100 rounded overflow-hidden',
                                'cursor-pointer bg-transparent hover:scale-[102%] transition-transform duration-200',
                                'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                            )}
                            onClick={() => openImage(image.id)}
                        >
                            <img
                                src={`file://${image.thumbnailPath ?? ''}`}
                                alt={image.id ?? ''}
                                className="h-full w-full shadow-md object-cover"
                                draggable={false}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
