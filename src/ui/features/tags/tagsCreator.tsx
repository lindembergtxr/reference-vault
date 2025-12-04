import { useState } from 'react'

import { cn } from '../../utils'
import { useTagsContext } from '../contexts/tagsCore'
import { TagsCSVInput } from './tagsCSVInput'
import { TagsCSVTable } from './tagsCSVTable'
import { useTagsCSVInput } from './tags.hooks'
import { MdOutlineTag } from 'react-icons/md'

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
                        'flex items-center justify-center py-2 px-4 gap-1 caption font-semibold',
                        'rounded outline-none bg-tetsu-800 text-tetsu-100',
                        'hover:bg-aoi-800 focus:ring-2 focus:ring-aoi-400 focus:border focus:border-aoi-400',
                        'dark:bg-tetsu-200 dark:text-tetsu-700 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-200',
                        'disabled:cursor-default disabled:bg-gray-400 disabled:text-gray-100',
                        'dark:disabled:bg-gray-500 dark:disabled:text-gray-300'
                    )}
                >
                    <MdOutlineTag className="h-4 w-4" />
                    CREATE TAGS
                </button>
            </div>

            <div className="flex flex-1 sm:flex-col xl:flex-row gap-6 overflow-hidden ">
                <TagsCSVInput {...csvInputProps} />

                <TagsCSVTable tags={csvInputProps.parsedTags} />
            </div>
        </div>
    )
}
