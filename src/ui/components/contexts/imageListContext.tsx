import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import { Context } from './imageListCore'

const PAGE_SIZE = 50

export const ImageListContext = ({ children }: PropsWithChildren) => {
    const hasLoaded = useRef(false)

    const [images, setImages] = useState<InternalImage[]>([])
    const [page, setPage] = useState<number>(1)

    const refreshImages = () => {
        window.api
            .getImageFiles()
            .then((res) => setImages(res.filter((images) => images?.thumbnailPath)))
    }

    const paginatedImages = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE
        const endIndex = startIndex + PAGE_SIZE

        return images.slice(startIndex, endIndex)
    }, [images, page])

    const totalPages = Math.ceil(images.length / PAGE_SIZE)

    useEffect(() => {
        if (hasLoaded.current === false) {
            refreshImages()
            hasLoaded.current = true
        }
    }, [])

    return (
        <Context
            value={{ images, page, totalPages, paginatedImages, setImages, setPage, refreshImages }}
        >
            {children}
        </Context>
    )
}
