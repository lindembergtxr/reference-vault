import { useCallback, useState } from 'react'
import { Button } from 'react-aria-components'

import { TagsInputController } from '../tags/tagsInputController'
import { CSVTag } from '../tags/tags.type'
import { cn } from '../../utils'
import { CSVTagToInternalTag } from '../tags/tags.utils'

type ImportImageProps = {
    image: InternalImage
    onCommit: (image: InternalImage<InternalTagNew>) => void
}
export const ImportImage = ({ image, onCommit }: ImportImageProps) => {
    const [tags, setTags] = useState<CSVTag[]>([])

    const isDirty = tags.some((tag) => tag.error)

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
        <div className="flex flex-col items-start gap-4 border-[1px] px-8 py-10 w-full h-full rounded-md shadow-md">
            <div className="flex flex-row items-start gap-4 w-full h-full">
                <div className="flex flex-col gap-4 justify-center w-80">
                    <img
                        src={`file://${image.thumbnail.path ?? ''}`}
                        alt={image.id ?? ''}
                        className="w-full h-auto shadow-md object-contain"
                        draggable={false}
                    />

                    <p className="flex items-center gap-2 paragraph-sm px-2 py-2 w-full border-[1px] border-gray-200 rounded-sm">
                        <strong>Name:</strong>
                        {image.id}
                    </p>
                </div>

                <div className="bg-gray-300 w-[2px]" />

                <div className="flex flex-col gap-2 w-full h-full">
                    <TagsInputController onTagsChange={onTagsChange} />
                </div>
            </div>
            <div className="flex w-full justify-end">
                <Button
                    className={cn(
                        'py-2 px-3 bg-aoi-900 text-aoi-100 caption rounded-md font-semibold cursor-pointer',
                        'hover:bg-aoi-700 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-default'
                    )}
                    isDisabled={isDirty}
                    onClick={commit}
                >
                    SAVE AND COMMIT
                </Button>
            </div>
        </div>
    )
}
