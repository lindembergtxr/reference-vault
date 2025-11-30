import { useRef, useState } from 'react'
import { Button } from 'react-aria-components'
import { MdOutlineClose, MdOutlineDelete } from 'react-icons/md'

import { cn, parseTagFull } from '../../utils'
import { useTagsContext } from '../contexts/tagsCore'

import { useCSVShortcuts, useTagFilter } from './tags.hooks'

export function TagsRemover() {
    const [selectedTags, setSelectedTags] = useState<InternalTag[]>([])

    const inputRef = useRef<HTMLInputElement>(null)

    const { refreshTags } = useTagsContext()

    const { filteredTags, inputValue, setInputValue } = useTagFilter()

    useCSVShortcuts({ ref: inputRef, text: inputValue, onChange: setInputValue })

    const selectTag = (tag: InternalTag) => {
        setInputValue('')
        setSelectedTags((prev) => (prev.some((t) => t.id === tag.id) ? prev : [...prev, tag]))
    }

    const removeTag = (tag: InternalTag) => {
        setSelectedTags((prev) => [...prev].filter((t) => t.id !== tag.id))
    }

    const submit = () => {
        window.api.removeTags({ tagIds: selectedTags.map((t) => t.id) }).then((res) => {
            if (res.success) {
                setSelectedTags([])
                setInputValue('')
                refreshTags()
            } else
                alert(`There was an error when trying to remove tags ${JSON.stringify(res.error)}`)
        })
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full">
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

            <div className="flex flex-col h-40 px-1 py-3 w-full overflow-hidden rounded border border-gray-400 dark:border-gray-600">
                <ul className="flex flex-col min-h-0 w-full px-3 py-1 overflow-scroll">
                    {filteredTags.map((tag) => (
                        <li
                            key={tag.id}
                            className="hover:bg-gray-300 hover:text-gray-900 hover:cursor-pointer"
                            onClick={() => selectTag(tag)}
                        >
                            {parseTagFull(tag)}
                        </li>
                    ))}
                    {filteredTags.length === 0 && (
                        <p className="font-mono text-xs">No sugestions</p>
                    )}
                </ul>
            </div>

            <div className="flex flex-col flex-1 w-full px-4 py-4 gap-3 rounded border border-gray-400 dark:border-gray-600 overflow-hidden">
                <div className="flex items-center justify-between w-full">
                    <p className="label text-sm font-semibold">Selected Tags</p>
                    <Button
                        className={cn(
                            'flex items-center justify-center py-2 px-4 gap-1 caption font-semibold',
                            'rounded outline-none bg-red-400 text-black',
                            'hover:bg-red-500 focus:ring-2 focus:ring-aoi-400 focus:border focus:border-aoi-400',
                            'dark:bg-tetsu-200 dark:text-tetsu-700 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-200',
                            'disabled:cursor-default disabled:bg-gray-400 disabled:text-gray-100',
                            'dark:disabled:bg-gray-500 dark:disabled:text-gray-300'
                        )}
                        isDisabled={selectedTags.length === 0}
                        onClick={submit}
                    >
                        <MdOutlineDelete className="w-4 h-4" />
                        {selectedTags.length === 0 ? 'Remove' : `Remove ${selectedTags.length}`}
                    </Button>
                </div>

                <ul className="flex flex-col gap-1 min-h-0 overflow-scroll">
                    {selectedTags.map((tag) => (
                        <li
                            key={tag.id}
                            className="flex items-center justify-between w-full font-mono text-xs py-0.5 pr-4 hover:bg-gray-300"
                        >
                            <p className="w-full">{parseTagFull(tag)}</p>

                            <Button
                                className="p-2 rounded caption text-sm font-semibold text-black hover:bg-red-300"
                                onClick={() => removeTag(tag)}
                            >
                                <MdOutlineClose className="h-3 w-3" />
                            </Button>
                        </li>
                    ))}
                    {selectedTags.length === 0 && (
                        <p className="label text-sm text-gray-400">No tags selected</p>
                    )}
                </ul>
            </div>
        </div>
    )
}
