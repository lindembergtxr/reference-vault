import { useEffect, useState } from 'react'

import { cn } from '../../utils'
import { useImageListContext } from '../contexts/imageListCore'
import { ImageListPreview } from './imageListPreview'
import { ImageListEmpty } from './imageListEmpty'

export const ImageList = () => {
    const [preview, setPreview] = useState<InternalImage | null>(null)

    const { images, paginatedImages } = useImageListContext()

    const currentIndex = images.findIndex((img) => preview && img.id === preview.id)

    const closePreview = () => setPreview(null)

    const nextImage = () => {
        if (!preview) return

        const currentIndex = images.findIndex((img) => img.id === preview.id)

        if (currentIndex === -1) return

        const nextIndex = (currentIndex + 1) % images.length
        setPreview(images[nextIndex])
    }

    const prevImage = () => {
        if (!preview) return

        const currentIndex = images.findIndex((img) => img.id === preview.id)

        if (currentIndex === -1) return

        const prevIndex = (currentIndex - 1 + images.length) % images.length
        setPreview(images[prevIndex])
    }

    const openImage = (id: string) => {
        const image = images.find((image) => image.id === id)

        if (image && !preview) setPreview(image)
    }

    useEffect(() => {
        setPreview(null)
    }, [images])

    if (images.length === 0) return <ImageListEmpty />

    if (preview)
        return (
            <ImageListPreview
                preview={preview}
                disableNext={currentIndex === images.length - 1}
                disablePrev={currentIndex === 0}
                prevImage={prevImage}
                nextImage={nextImage}
                closePreview={closePreview}
            />
        )

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-4 py-10 h-full overflow-y-auto">
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {paginatedImages.map((image) => (
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
