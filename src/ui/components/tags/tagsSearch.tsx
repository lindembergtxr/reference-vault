import { useRef, useState } from 'react'
import { Button } from 'react-aria-components'
import { MdOutlineAdd, MdOutlineClose, MdOutlineRemove, MdSearch } from 'react-icons/md'

import { parseTag } from '../../utils/tags'
import { cn } from '../../utils/classname'
import { useImageListContext } from '../contexts/imageListCore'

import { useTagFilter } from './tags.hooks'
import { TagsSearchInput } from './tagsSearchInput'

export const TagsSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null)

    const { filteredTags, inputValue, setInputValue } = useTagFilter()

    const { setSearch } = useImageListContext()

    const [selectedTags, setSelectedTags] = useState<InternalTag[]>([])

    function removeTag(tagId: string) {
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId))
    }

    function toggleTag(index: number) {
        setSelectedTags((prev) => {
            const temp = [...prev]
            const tag = temp[index]

            temp[index] = { ...tag, mode: tag.mode === 'exclude' ? 'include' : 'exclude' }

            return temp
        })
    }

    function clearSearch() {
        setSelectedTags([])
        setSearch([])
    }

    function onSearch() {
        setInputValue('')
        setSearch(selectedTags)
    }

    function selectItem(tag: InternalTag) {
        setSelectedTags((prev) => {
            if (prev.some((el) => el.id === tag.id)) return prev
            return [...prev, { ...tag, mode: 'include' }]
        })
        setInputValue('')
        inputRef.current?.focus()
    }

    return (
        <div className="flex flex-col items-center gap-2 w-full h-full px-1 pr-2">
            <div className="flex flex-col gap-2 h-full w-full p-3 overflow-hidden border border-tetsu-300/80 dark:border-tetsu-700 rounded">
                <p className="font-semibold dark:text-tetsu-300 text-sm">Selected tags</p>

                <ul className="min-h-0 overflow-scroll">
                    {selectedTags.map((searchTag, index) => (
                        <li
                            key={searchTag.id}
                            className="flex itens-center justify-between w-full gap-2 dark:text-tetsu-200"
                        >
                            <Button
                                className={cn(
                                    'rounded-md',
                                    searchTag.mode === 'exclude'
                                        ? 'bg-red-400 text-red-900'
                                        : 'bg-green-400 text-green-950'
                                )}
                                onClick={() => toggleTag(index)}
                            >
                                {searchTag.mode === 'exclude' ? (
                                    <MdOutlineRemove className="w-5 h-5" />
                                ) : (
                                    <MdOutlineAdd className="w-5 h-5" />
                                )}
                            </Button>

                            <span className="w-full truncate">{parseTag(searchTag)}</span>

                            <Button onClick={() => removeTag(searchTag.id)}>
                                <MdOutlineClose className="w-5 h-5" />
                            </Button>
                        </li>
                    ))}
                    {selectedTags.length === 0 && (
                        <li className="font-mono text-xs font-normal text-tetsu-300 dark:text-tetsu-500">
                            No tag selected to search...
                        </li>
                    )}
                </ul>
            </div>

            <div className="flex w-full items-center gap-4">
                <Button
                    className={cn(
                        'flex items-center caption font-semibold px-3 py-2 text-gray-800 whitespace-nowrap',
                        'rounded border border-tetsu-800',
                        'hover:bg-tetsu-700 hover:text-tetsu-100 hover:cursor-pointer',
                        'dark:border-tetsu-300 dark:text-tetsu-200 dark:hover:bg-tetsu-200 dark:hover:text-tetsu-700'
                    )}
                    onClick={() => clearSearch()}
                >
                    CLEAR SEARCH
                </Button>

                <Button
                    className={cn(
                        'flex items-center justify-center py-2 w-full gap-1 caption font-semibold',
                        'rounded outline-none bg-tetsu-800 text-tetsu-100',
                        'hover:bg-aoi-800 focus:ring-2 focus:ring-aoi-400 focus:border focus:border-aoi-400',
                        'dark:bg-tetsu-200 dark:text-tetsu-700 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-200'
                    )}
                    onClick={onSearch}
                >
                    <MdSearch size={16} /> SEARCH
                </Button>
            </div>

            <TagsSearchInput
                inputValue={inputValue}
                tags={filteredTags}
                selectTag={selectItem}
                setInputValue={setInputValue}
            />
        </div>
    )
}
