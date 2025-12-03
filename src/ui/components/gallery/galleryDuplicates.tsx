import { useEffect, useRef, useState } from 'react'

import { ImageList } from '../images/imageList'
import { ImageListPreview } from '../images/imageListPreview'
import { useImagePreview } from '../images/images.hooks'

import { GalleryDuplicatesEmpty } from './galleryDuplicatesEmpty'
import { useImageListContext } from '../contexts/imageListCore'
import { Button } from 'react-aria-components'
import { cn } from '../../utils'
import { MdOutlineDelete } from 'react-icons/md'

export function GalleryDuplicates() {
    const [scrollPosition, setScrollPosition] = useState(0)
    const [confirming, setConfirming] = useState(false)

    const { duplicateImages, refresh } = useImageListContext()

    const { preview, openImage, ...previewProps } = useImagePreview({ images: duplicateImages })

    const currentIndex = duplicateImages.findIndex((img) => preview && img.id === preview.id)

    const divRef = useRef<HTMLDivElement>(null)

    function onImageOpen(id: string) {
        const container = divRef.current

        setScrollPosition(container?.scrollTop ?? 0)
        openImage(id)
    }

    function deleteAll() {
        window.api.batchDeleteImages(duplicateImages.map((i) => i.id)).then((res) => {
            if (res.success) refresh()
            else alert(`There was an error deleting these images - ${JSON.stringify(res.error)}`)
        })
    }

    function onDeleteClick() {
        if (!confirming) setConfirming(true)
        else deleteAll()
    }

    function onDeleteBlur() {
        setConfirming(false)
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
        <div className="flex flex-col gap-3 w-full h-full overflow-hidden">
            <div className="flex items-center w-full px-4 mt-5">
                <Button
                    className={cn(
                        'flex items-center gap-1 justify-self-start',
                        'px-3 py-2 caption text-xs bg-transparent text-aoi-800',
                        'outline-none rounded border border-aoi-800',
                        'hover:bg-red-400 hover:border-red-400 hover:text-red-50 hover:cursor-pointer'
                    )}
                    onBlur={onDeleteBlur}
                    onClick={onDeleteClick}
                >
                    <MdOutlineDelete className="h-3 w-3" />
                    {confirming ? "Yes, delete'em all" : 'Delete all duplicates'}
                </Button>
            </div>

            <ImageList
                divRef={divRef}
                images={duplicateImages}
                totalCount={duplicateImages.length}
                openImage={onImageOpen}
            />
        </div>
    )
}
