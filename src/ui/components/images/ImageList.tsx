import { useState } from 'react'

import { cn, parseTag } from '../../utils'
import { ImagePreview } from './ImagePreview'
import { useImageListContext } from '../contexts/imageListCore'

export const ImageList = () => {
    const [preview, setPreview] = useState<InternalImage | null>(null)

    const { images, paginatedImages } = useImageListContext()

    const openImage = (id: string) => {
        const image = images.find((image) => image.id === id)

        if (image && !preview) setPreview(image)
    }

    const closePreview = () => setPreview(null)

    if (images.length === 0) {
        return (
            <div className="flex h-full w-full justify-center p-10">
                <p className="caption font-mono text-sm text-tetsu-400">
                    Select tags to show results...
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full">
            {preview ? (
                <div className="flex flex-col w-full h-full gap-2">
                    <div className="flex flex-1 h-full">
                        <ImagePreview image={preview} closePreview={closePreview} />
                    </div>
                    <div className="flex flex-col gap-3 w-full px-4 py-2">
                        {preview.tags.map((tag) => parseTag(tag)).join(', ')}
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    )
}
