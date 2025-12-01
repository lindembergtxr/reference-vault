import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { Context } from './imageListCore'

const PAGE_SIZE = 50

export const ImageListContext = ({ children }: PropsWithChildren) => {
    const [search, setSearch] = useState<InternalTag[]>([])
    const [images, setImages] = useState<InternalImage[]>([])
    const [page, setPage] = useState<number>(1)
    const [committedImagesCount, setCount] = useState(0)

    const updateCount = useCallback(() => {
        window.api.countImages().then((res) => {
            if (res.success && typeof res.data === 'number') setCount(res.data ?? 0)
        })
    }, [])

    const refreshImages = useCallback(() => {
        if (search.length > 0) {
            window.api
                .getImageFiles({ tagIds: search.map((tag) => tag.id) })
                .then((res) => setImages(res.filter((images) => images?.thumbnailPath)))
        } else setImages([])
        updateCount()
    }, [search, updateCount])

    const paginatedImages = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE
        const endIndex = startIndex + PAGE_SIZE

        return images.slice(startIndex, endIndex)
    }, [images, page])

    const totalPages = Math.ceil(images.length / PAGE_SIZE)

    useEffect(() => {
        setPage(1)
    }, [search.length, images.length])

    useEffect(() => {
        refreshImages()
    }, [refreshImages])

    return (
        <Context
            value={{
                images,
                page,
                totalPages,
                paginatedImages,
                search,
                committedImagesCount,
                setSearch,
                setImages,
                setPage,
                refreshImages,
            }}
        >
            {children}
        </Context>
    )
}
