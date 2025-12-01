import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-aria-components'
import { MdOutlineEdit } from 'react-icons/md'

import { cn } from '../../utils'
import { useTagsContext } from '../contexts/tagsCore'

import { useCSVShortcuts, useTagFilter } from './tags.hooks'
import { parseCsv, parseTagToCSVString } from './tags.utils'

export function TagsEditor() {
    const inputRef = useRef<HTMLInputElement>(null)

    const [selectedTag, setSelectedTag] = useState<InternalTag | null>(null)
    const [errorMessage, setErrorMessage] = useState('')

    const { refreshTags } = useTagsContext()

    const { filteredTags, inputValue, setInputValue } = useTagFilter()

    useCSVShortcuts({ ref: inputRef, text: inputValue, onChange: setInputValue })

    function selectTag(tag: InternalTag) {
        setSelectedTag(tag)
        setInputValue(parseTagToCSVString(tag))
        setErrorMessage('')
    }

    function removeTag() {
        setInputValue('')
        setSelectedTag(null)
        setErrorMessage('')
    }

    const submit = () => {
        if (selectedTag) {
            window.api.updateTag(selectedTag).then((res) => {
                if (res.success) {
                    removeTag()
                    refreshTags()
                    alert('Tag updated successfully!')
                } else alert(`Failed to update tag! - ${res.error}`)
            })
        }
    }

    useEffect(() => {
        const tag = parseCsv(inputValue)?.[0]

        if (!tag || !selectedTag) return

        if (tag.error) {
            setErrorMessage(tag.error)
            return
        } else {
            setErrorMessage('')
        }

        if (
            tag.name === selectedTag.name &&
            tag.franchise === selectedTag.franchise &&
            tag.category === selectedTag.category
        ) {
            return
        }

        setSelectedTag({
            id: selectedTag.id,
            name: tag.name,
            franchise: tag.franchise,
            category: tag.category,
        })
    }, [selectedTag, inputValue])

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex items-center justify-between w-full">
                <p className="caption text-sm font-medium">
                    {selectedTag?.id
                        ? `Selected tag ID=${selectedTag.id}`
                        : 'Search and select a tag to begin'}
                </p>

                <div className="flex items-center gap-3">
                    <Button
                        className={cn(
                            'flex items-center caption font-semibold px-3 py-2 text-gray-800 whitespace-nowrap',
                            'rounded border border-tetsu-800',
                            'hover:bg-tetsu-700 hover:text-tetsu-100 hover:cursor-pointer',
                            'dark:border-tetsu-300 dark:text-tetsu-200 dark:hover:bg-tetsu-200 dark:hover:text-tetsu-700'
                        )}
                        onClick={removeTag}
                    >
                        CLEAR
                    </Button>

                    <Button
                        className={cn(
                            'flex items-center justify-center py-2 px-3 w-full gap-1 caption font-semibold',
                            'rounded outline-none bg-tetsu-800 text-tetsu-100 border border-tetsu-800',
                            'hover:bg-aoi-800 focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400',
                            'dark:bg-tetsu-200 dark:text-tetsu-700 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-200',
                            'disabled:cursor-default disabled:bg-gray-400 disabled:text-gray-100',
                            'dark:disabled:bg-gray-500 dark:disabled:text-gray-300'
                        )}
                        isDisabled={!!errorMessage}
                        onClick={submit}
                    >
                        <MdOutlineEdit className="w-4 h-4" />
                        EDIT
                    </Button>
                </div>
            </div>

            <input
                ref={inputRef}
                type="text"
                className={cn(
                    'w-full rounded px-4 py-2 font-mono text-xs bg-aoi-950 text-green-400',
                    'outline-none'
                )}
                placeholder="Type something to see sugestions..."
                value={inputValue}
                onChange={(evt) => setInputValue(evt.target.value)}
            />

            {selectedTag && errorMessage && (
                <p className="font-mono text-sm text-red-500">{errorMessage}</p>
            )}

            {!selectedTag && (
                <div className="flex flex-col h-40 px-1 py-3 w-full overflow-hidden rounded border border-gray-400 dark:border-gray-600">
                    <ul className="flex flex-col min-h-0 w-full px-3 py-1 overflow-scroll">
                        {filteredTags.map((tag) => (
                            <li
                                key={tag.id}
                                className="hover:bg-gray-300 hover:text-gray-900 hover:cursor-pointer"
                                onClick={() => selectTag(tag)}
                            >
                                {parseTagToCSVString(tag)}
                            </li>
                        ))}
                        {filteredTags.length === 0 && (
                            <p className="font-mono text-xs">No sugestions</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}
