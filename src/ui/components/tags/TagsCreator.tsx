import { useState } from 'react'

import { cn } from '../../utils'
import { useTagsContext } from '../contexts/tagsCore'
import { TagsCSVInput } from './tagsCSVInput'
import { TagsCSVTable } from './tagsCSVTable'
import { useTagsCSVInput } from './tags.hooks'

export const TagsCreator = () => {
    const [isLoading, setIsLoading] = useState(false)

    const { refreshTags } = useTagsContext()

    const csvInputProps = useTagsCSVInput()

    const invalid = csvInputProps.parsedTags.filter((p) => p.error)
    const valid = csvInputProps.parsedTags.filter((p) => !p.error)

    const canImport = valid.length > 0 && invalid.length === 0 && !isLoading

    const submitTags = async () => {
        try {
            const internalTags = csvInputProps.parsedTags.map<InternalTagNew>((tag) => ({
                id: null,
                name: tag.name,
                category: tag.category,
                franchise: tag.franchise,
            }))

            setIsLoading(true)

            await window.api.createTags(internalTags)

            csvInputProps.onChange('')
            refreshTags()

            alert('Tags saved successfully!')
        } catch (error) {
            window.api.logError({ message: 'Failed to create tags', error })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-end w-full">
                <button
                    disabled={!canImport}
                    onClick={submitTags}
                    className={cn(
                        'px-4 h-8 bg-aoi-900 text-aoi-200 font-semibold caption rounded-md cursor-pointer',
                        'disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-default'
                    )}
                >
                    Import tags
                </button>
            </div>

            <div className="flex flex-1 flex-row gap-6 overflow-hidden">
                <TagsCSVInput {...csvInputProps} />

                <TagsCSVTable tags={csvInputProps.parsedTags} />
            </div>
        </div>
    )
}
