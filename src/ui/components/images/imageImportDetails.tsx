import { useCallback, useState } from 'react'
import { cn } from '../../utils'
import { CSVTag } from '../tags/tags.type'
import { TagsInputController } from '../tags/tagsInputController'
import { ImageImportPagination, PaginationProps } from './imageImportPagination'
import { CSVTagToInternalTag } from '../tags/tags.utils'
import { Button } from 'react-aria-components'
import { MdOutlineClose } from 'react-icons/md'

type ImageImportDetailsProps = PaginationProps & {
    image: InternalImage
    closePreview: () => void
    onCommit: (image: InternalImage<InternalTagNew>) => void
}
export function ImageImportDetails({
    image,
    onCommit,
    closePreview,
    ...paginationProps
}: ImageImportDetailsProps) {
    const [tags, setTags] = useState<CSVTag[]>([])

    const isDirty = tags.some((tag) => tag.error) || tags.length === 0

    const commit = () => {
        onCommit({ ...image, tags: tags.map(CSVTagToInternalTag) })
    }

    const onTagsChange = useCallback((tagList: CSVTag[]) => {
        setTags((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(tagList)) return prev
            return tagList
        })
    }, [])

    return (
        <ImageImportPagination {...paginationProps}>
            <div className="relative flex flex-col items-center gap-4 w-full h-full px-8 pt-12 pb-6 border rounded shadow-md">
                <Button className="absolute top-5 right-7" onClick={closePreview}>
                    <MdOutlineClose className="h-6 w-6" />
                </Button>

                <div className="flex flex-col justify-center items-center gap-8 w-full h-full">
                    <div className="flex flex-col justify-center gap-3 w-fit h-1/2">
                        <img
                            src={`file://${image.imagePath ?? ''}`}
                            alt={image.id ?? ''}
                            className="h-full w-auto shadow-md object-contain"
                            draggable={false}
                        />

                        <p className="paragraph-sm font-medium text-center rounded">{image.id}</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full flex-1 overflow-auto">
                        <TagsInputController onTagsChange={onTagsChange} />

                        <div className="flex w-full justify-center mb-2">
                            <Button
                                className={cn(
                                    'py-2 px-3 bg-aoi-900 text-aoi-100 caption rounded-md font-semibold cursor-pointer border',
                                    'hover:bg-aoi-700 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-default',
                                    'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                                )}
                                isDisabled={isDirty}
                                onClick={commit}
                            >
                                SAVE AND COMMIT
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ImageImportPagination>
    )
}
