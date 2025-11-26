import { useMemo, useState } from 'react'

import { cn, parseTag } from '../../utils'
import { Pagination } from '../common/paginator'
import { ImagePreview } from './ImagePreview'

const PAGE_SIZE = 50

type ImageListProps = {
    images: InternalImage[]
}
export const ImageList = ({ images }: ImageListProps) => {
    const [page, setPage] = useState(1)
    const [preview, setPreview] = useState<InternalImage | null>(null)

    const openImage = (id: string) => {
        const image = images.find((image) => image.id === id)

        if (image && !preview) setPreview(image)
    }

    const closePreview = () => setPreview(null)

    const onPageChange = (newPage: number) => setPage(newPage)

    const paginatedImages = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE
        const endIndex = startIndex + PAGE_SIZE

        return images.slice(startIndex, endIndex)
    }, [images, page])

    return (
        <div className="flex flex-col h-full w-full">
            {preview ? (
                <div className="flex w-full h-full gap-2">
                    <div className="flex flex-1 h-full">
                        <ImagePreview image={preview} closePreview={closePreview} />
                    </div>
                    <div className="flex w-[30%]">
                        {preview.tags.map((tag) => parseTag(tag)).join(', ')}
                    </div>
                </div>
            ) : (
                <div className="px-4 py-10 h-full w-full overflow-scroll">
                    <div className="grid grid-cols-5 gap-2">
                        {paginatedImages.map((image) => (
                            <button
                                key={image.id}
                                className={cn(
                                    'relative aspect-square flex items-center justify-center bg-gray-100 rounded overflow-hidden',
                                    'cursor-pointer bg-transparent hover:scale-105 transition-transform duration-200',
                                    'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                                )}
                                onClick={() => openImage(image.id)}
                            >
                                <img
                                    src={`file://${image.thumbnail.path ?? ''}`}
                                    alt={image.id ?? ''}
                                    className="max-h-full max-w-full shadow-md object-contain"
                                    draggable={false}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-center w-full">
                        <Pagination
                            currentPage={page}
                            totalPages={Math.ceil(images.length / PAGE_SIZE)}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
