import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { Context } from './imageListCore'

const PAGE_SIZE = 50

export const ImageListContext = ({ children }: PropsWithChildren) => {
    const [search, setSearch] = useState<InternalTag[]>([])
    const [images, setImages] = useState<InternalImage[]>([])
    const [duplicateImages, setDuplicateImages] = useState<InternalImage[]>([])
    const [page, setPage] = useState(1)
    const [scrollPosition, setScrollPosition] = useState(1)
    const [committedImagesCount, setCount] = useState(0)

    const updateCount = useCallback(() => {
        window.api.countImages().then((res) => {
            if (res.success && typeof res.data === 'number') setCount(res.data ?? 0)
        })
    }, [])

    const refreshImages = useCallback(() => {
        if (search.length > 0) {
            window.api
                .getImageFiles({
                    include: search.filter((tag) => tag.mode !== 'exclude').map((tag) => tag.id),
                    exclude: search.filter((tag) => tag.mode === 'exclude').map((tag) => tag.id),
                } satisfies GetImagesSearchArgs)
                .then((res) => setImages(res.filter((images) => images?.thumbnailPath)))
        } else setImages([])
        updateCount()
    }, [search, updateCount])

    const refreshDuplicateImages = useCallback(() => {
        window.api.getDuplicateImages().then((res) => setDuplicateImages(res))
    }, [])

    const refresh = useCallback(() => {
        refreshImages()
        refreshDuplicateImages()
    }, [refreshDuplicateImages, refreshImages])

    const paginatedImages = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE
        const endIndex = startIndex + PAGE_SIZE

        return images.slice(startIndex, endIndex)
    }, [images, page])

    const totalPages = Math.ceil(images.length / PAGE_SIZE)

    useEffect(() => {
        setPage(1)
    }, [search.length])

    useEffect(() => {
        setPage((prev) => Math.min(prev, Math.ceil(images.length / PAGE_SIZE) || 1))
    }, [images.length])

    useEffect(() => {
        refresh()
    }, [refresh])

    return (
        <Context
            value={{
                images,
                duplicateImages,
                page,
                totalPages,
                paginatedImages,
                search,
                committedImagesCount,
                scrollPosition,
                setScrollPosition,
                setSearch,
                setImages,
                setPage,
                refresh,
            }}
        >
            {children}
        </Context>
    )
}
