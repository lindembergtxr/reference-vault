import { useEffect, useRef, useState } from 'react'

import { ImageList } from '../images/imageList'
import { ImageListPreview } from '../images/imageListPreview'
import { useImagePreview } from '../images/images.hooks'

import { GalleryDuplicatesEmpty } from './galleryDuplicatesEmpty'
import { useImageListContext } from '../contexts/imageListCore'

export function GalleryDuplicates() {
    const [scrollPosition, setScrollPosition] = useState(0)

    const { duplicateImages, setDuplicateImages } = useImageListContext()

    const { preview, openImage, ...previewProps } = useImagePreview({ images: duplicateImages })

    const currentIndex = duplicateImages.findIndex((img) => preview && img.id === preview.id)

    const divRef = useRef<HTMLDivElement>(null)

    function refreshData() {
        window.api.getDuplicateImages().then((res) => setDuplicateImages(res))
    }

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
        setScrollPosition(0)
        refreshData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (duplicateImages.length === 0) return <GalleryDuplicatesEmpty />

    if (preview) {
        return (
            <ImageListPreview
                preview={preview}
                disableNext={currentIndex === duplicateImages.length - 1}
                disablePrev={currentIndex === 0}
                {...previewProps}
            />
        )
    }

    return (
        <ImageList
            divRef={divRef}
            images={duplicateImages}
            totalCount={duplicateImages.length}
            openImage={onImageOpen}
        />
    )
}
