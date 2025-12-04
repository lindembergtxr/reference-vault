import { useEffect, useState } from 'react'

type UseImagePreviewArgs = {
    images: InternalImage[]
}
export function useImagePreview({ images }: UseImagePreviewArgs) {
    const [preview, setPreview] = useState<InternalImage | null>(null)

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

    return { preview, currentIndex, closePreview, prevImage, nextImage, openImage }
}
