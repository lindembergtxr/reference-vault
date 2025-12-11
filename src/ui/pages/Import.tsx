import { useEffect, useRef, useState } from 'react'

import { useTagsContext } from '../features/contexts/tagsCore'
import { useImageListContext } from '../features/contexts/imageListCore'
import { ImageImportDetails } from '../features/images/imageImportDetails'
import { ImageImportEmpty } from '../features/images/imageImportEmpty'
import { useImagePreview } from '../features/images/images.hooks'
import { ImageList } from '../features/images/imageList'

export const ImportPage = () => {
    const [images, setImages] = useState<InternalImage[]>([])

    const { refresh, scrollPosition, setScrollPosition } = useImageListContext()
    const { refreshTags } = useTagsContext()

    const { preview, openImage, closePreview, ...previewProps } = useImagePreview({ images })

    const currentIndex = images.findIndex((img) => preview && img.id === preview.id)

    const refreshData = () => window.api.getStagedFiles({}).then((res) => setImages(res))

    const importData = () => window.api.importFiles().then(() => refreshData())

    const onCommit = (image: InternalImage<InternalTagNew>) => {
        window.api.commitImage(image).then((res) => {
            if (res.success) {
                refreshData()
                refreshTags()
                refresh()
            } else {
                alert(`Commit failed! - ${JSON.stringify(res.error)}`)
            }
        })
    }

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
        setScrollPosition(0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        refreshData()
    }, [])

    if (images.length === 0) return <ImageImportEmpty importData={importData} />

    if (preview)
        return (
            <ImageImportDetails
                image={preview}
                disableNext={currentIndex === images.length - 1}
                disablePrev={currentIndex === 0}
                {...previewProps}
                onCommit={onCommit}
                closePreview={closePreview}
            />
        )

    return (
        <ImageList
            divRef={divRef}
            images={images}
            totalCount={images.length}
            openImage={onImageOpen}
        />
    )
}
