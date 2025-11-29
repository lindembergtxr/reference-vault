import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { Context } from './imageListCore'

const PAGE_SIZE = 50

export const ImageListContext = ({ children }: PropsWithChildren) => {
    const [search, setSearch] = useState<InternalTag[]>([])
    const [images, setImages] = useState<InternalImage[]>([])
    const [page, setPage] = useState<number>(1)

    const refreshImages = useCallback(() => {
        if (search.length > 0) {
            window.api
                .getImageFiles({ tagIds: search.map((tag) => tag.id) })
                .then((res) => setImages(res.filter((images) => images?.thumbnailPath)))
        } else setImages([])
    }, [search])

    const paginatedImages = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE
        const endIndex = startIndex + PAGE_SIZE

        return images.slice(startIndex, endIndex)
    }, [images, page])

    const totalPages = Math.ceil(images.length / PAGE_SIZE)

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
