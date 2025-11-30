import { useEffect, useState } from 'react'
import { cn, parseTag } from '../../utils'
import { Button } from 'react-aria-components'
import { ImageListPreviewEdit } from './imageListPreviewEdit'
import { EditableTag } from './images.types'
import { useImageListContext } from '../contexts/imageListCore'
import { useTagsContext } from '../contexts/tagsCore'
import { MdOutlineDelete } from 'react-icons/md'

type ImageListPreviewDetailsProps = {
    image: InternalImage
}
export function ImageListPreviewDetails({ image }: ImageListPreviewDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const [tags, setTags] = useState<EditableTag[]>([])

    const { refreshTags } = useTagsContext()
    const { setImages, refreshImages } = useImageListContext()

    const discardChanges = () => {
        setIsEdit(false)
        setTags(image.tags.map((tag) => ({ ...tag, status: 'original' })))
    }

    const deleteImage = () => {
        window.api.deleteImage(image.id).then((res) => {
            if (res.success) refreshImages()
            else alert(`Failed to delete image - ${res.error}`)
        })
    }

    const saveChanges = async () => {
        try {
            const toRemove: InternalTagNew[] = tags.filter((t) => t.status === 'removed')
            const toAdd: InternalTagNew[] = tags
                .filter((t) => t.status === 'added')
                .map((t) => ({ ...t, id: null }))

            let updatedTags: InternalTag[] = image.tags

            if (toRemove.length > 0) {
                const response = await window.api.removeTagsFromImage({
                    imageId: image.id,
                    tags: toRemove,
                })

                if (response.success && response.data) updatedTags = response.data.tags
            }

            if (toAdd.length > 0) {
                const response = await window.api.addTagsToImage({
                    imageId: image.id,
                    tags: toAdd,
                })

                if (response.success && response.data) updatedTags = response.data.tags
            }

            setImages((prev) => {
                const temp = [...prev]
                const index = temp.findIndex((i) => i.id === image.id)

                if (index > -1) temp.splice(index, 1, { ...image, tags: updatedTags })

                return temp
            })
            setIsEdit(false)
            setIsExpanded(false)
            refreshTags()
        } catch (error) {
            alert(`Operation failed ${error}`)
        }
    }

    useEffect(() => {
        setTags(image.tags.map((tag) => ({ ...tag, status: 'original' })))
    }, [image.tags])

    if (!isExpanded) {
        return (
            <div className="flex flex-col items-center gap-3 w-full px-4 py-2 rounded-md border border-gray-400 mb-3">
                <Button
                    className={cn(
                        'caption text-xs bg-transparent text-aoi-800 rounded-md border border-aoi-800 w-fit px-3 py-2',
                        'hover:bg-aoi-800 hover:text-aoi-100 hover:cursor-pointer'
                    )}
                    onClick={() => setIsExpanded(true)}
                >
                    See details
                </Button>
            </div>
        )
    }

    if (isEdit) {
        return (
            <ImageListPreviewEdit
                currentTags={tags}
                onChangeTags={setTags}
                onClose={discardChanges}
                onSubmit={saveChanges}
            />
        )
    }

    return (
        <div className="flex flex-col items-center gap-3 w-full px-4 py-2 rounded-md border border-gray-400 mb-3">
            <p className="font-mono text-sm flex items-center gap-2">
                <strong>Title</strong>
                {image.id}
            </p>

            <div className="flex flex-col gap-2">
                {image.tags.map((tag) => parseTag(tag)).join(', ')}
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
                <Button
                    className={cn(
                        'caption text-xs bg-transparent text-aoi-800 rounded-md border border-aoi-800 w-fit px-3 py-2',
                        'hover:bg-aoi-800 hover:text-aoi-100 hover:cursor-pointer'
                    )}
                    onClick={() => setIsExpanded(false)}
                >
                    Collapse details
                </Button>

                <Button
                    className={cn(
                        'caption text-xs bg-aoi-800 text-aoi-100 rounded-md w-fit px-3 py-2',
                        'hover:bg-aoi-700 hover:cursor-pointer'
                    )}
                    onClick={() => setIsEdit(true)}
                >
                    Edit image
                </Button>

                <Button
                    className={cn(
                        'flex items-center gap-1 caption text-xs bg-transparent text-aoi-800 rounded-md w-fit px-3 py-2',
                        'outline-none border border-aoi-800',
                        'hover:bg-red-400 hover:border-red-400 hover:text-red-50 hover:cursor-pointer'
                    )}
                    onClick={deleteImage}
                >
                    <MdOutlineDelete className="h-3 w-3" /> Delete image
                </Button>
            </div>
        </div>
    )
}
