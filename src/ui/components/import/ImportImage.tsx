import { useState } from 'react'

import { ImageCard, ImageCardProps } from '../images/ImageCard'
import { TagsInput } from '../tags/TagInput'
import { Button, Input, Label } from 'react-aria-components'

type ImportImageProps = {
    image: InternalImage
    onCommit: () => void
}
export const ImportImage = ({ image, onCommit }: ImportImageProps) => {
    const [mode] = useState<ImageCardProps['mode']>(undefined)

    const [tags, setTags] = useState<InternalTag[]>([])

    const commitImage = () => {
        window.api.commitImage({ ...image, tags }).then((res) => {
            console.log(res)
            onCommit()
        })
    }

    return (
        <div className="flex flex-row gap-4 border-[1px] px-8 py-4 w-full rounded-md">
            <div className="flex items-center justify-center w-64 h-64">
                <ImageCard
                    key={image.id}
                    size="xl"
                    isSelected={false}
                    mode={mode}
                    imageId={image.id}
                    url={image.thumbnailPath!}
                />
            </div>

            <div className="bg-gray-300 w-[2px]" />

            <div className="flex flex-col gap-2 w-full">
                <Button
                    className="py-1 px-2 bg-green-300 rounded-md text-green-900 label ml-auto"
                    onClick={commitImage}
                >
                    Commit
                </Button>

                <Label
                    htmlFor={`${image.id}-image-title`}
                    className="flex flex-col items-start paragraph-md font-semibold"
                >
                    Title
                    <Input
                        id={`${image.id}-image-title`}
                        className="paragraph-sm px-2 py-2 w-full border-[1px] border-gray-200 rounded-sm"
                        disabled
                        value={image.id}
                    />
                </Label>

                <TagsInput onTagsChange={(tagList) => setTags(tagList)} />
            </div>
        </div>
    )
}
