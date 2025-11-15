import { useEffect, useRef, useState } from 'react'
import { ImageCard } from '../components/images/ImageCard'
import { ImagePreview } from '../components/images/ImagePreview'
import { parseTag } from '../utils/tags'

export const Home = () => {
    const hasLoaded = useRef(false)

    const [images, setImages] = useState<InternalImage[]>([])
    const [preview, setPreview] = useState<InternalImage | null>(null)

    const refreshData = () => {
        window.api.getImageFiles().then((res) => setImages(res))
    }

    const openImage = (imageId: string) => {
        const image = images.find((image) => image.id === imageId)

        if (image && !preview) setPreview(image)
    }

    const closePreview = () => setPreview(null)

    useEffect(() => {
        if (hasLoaded.current === false) {
            refreshData()
            hasLoaded.current = true
        }
    }, [])

    return (
        <div className="grid grid-cols-1 grid-rows-1 h-full w-full">
            {preview ? (
                <div className="grid grid-rows-[1fr_auto] grid-cols-1 h-full w-full gap-y-4">
                    <div className="col-span-1 row-span-1 overflow-hidden">
                        <ImagePreview image={preview} closePreview={closePreview} />
                    </div>
                    <div className="col-span-1 row-span-1">
                        {preview.tags.map((tag) => parseTag(tag)).join(', ')}
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap w-full h-full px-4 gap-y-4 gap-x-6">
                    {images.map((image) => (
                        <ImageCard
                            size="xl"
                            mode="open"
                            key={image.id}
                            imageId={image.id}
                            url={image.thumbnailPath ?? ''}
                            isSelected={false}
                            onOpen={openImage}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
