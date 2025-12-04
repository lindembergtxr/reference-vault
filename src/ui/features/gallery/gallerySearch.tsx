import { useEffect, useRef } from 'react'

import { useImageListContext } from '../contexts/imageListCore'
import { ImageList } from '../images/imageList'
import { ImageListPreview } from '../images/imageListPreview'
import { useImagePreview } from '../images/images.hooks'

import { GallerySearchEmpty } from './gallerySearchEmpty'

export function GallerySearch() {
    const { images, page, paginatedImages, scrollPosition, setScrollPosition } =
        useImageListContext()

    const { preview, openImage, ...previewProps } = useImagePreview({ images })

    const currentIndex = images.findIndex((img) => preview && img.id === preview.id)

    const divRef = useRef<HTMLDivElement>(null)

    function onImageOpen(id: string) {
        const container = divRef.current

        setScrollPosition(container?.scrollTop ?? 0)
        openImage(id)
    }

    useEffect(() => {
        if (!preview) {
            requestAnimationFrame(() => {
                if (divRef.current) divRef.current.scrollTop = scrollPosition
            })
            setScrollPosition(0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preview])

    useEffect(() => {
        requestAnimationFrame(() => {
            if (divRef.current) divRef.current.scrollTop = 0
        })
        setScrollPosition(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    useEffect(() => {
        setScrollPosition(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (images.length === 0) return <GallerySearchEmpty />

    if (preview) {
        return (
            <ImageListPreview
                preview={preview}
                disableNext={currentIndex === images.length - 1}
                disablePrev={currentIndex === 0}
                {...previewProps}
            />
        )
    }

    return (
        <ImageList
            divRef={divRef}
            images={paginatedImages}
            totalCount={images.length}
            openImage={onImageOpen}
        />
    )
}
