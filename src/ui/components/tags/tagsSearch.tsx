import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-aria-components'
import {
    MdOutlineAdd,
    MdOutlineClearAll,
    MdOutlineClose,
    MdOutlineRemove,
    MdSearch,
} from 'react-icons/md'

import { parseTag } from '../../utils/tags'
import { cn } from '../../utils/classname'
import { useImageListContext } from '../contexts/imageListCore'

import { useTagFilter } from './tags.hooks'
import { TagsSearchInput } from './tagsSearchInput'
import { useLocation, useNavigate } from 'react-router-dom'

export const TagsSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const location = useLocation()

    const { tags, filteredTags, inputValue, setInputValue } = useTagFilter()

    const { setSearch } = useImageListContext()

    const [selectedTags, setSelectedTags] = useState<InternalTag[]>([])

    const includedCount = selectedTags.reduce((acc, curr) => {
        return curr.mode === 'include' ? acc + 1 : acc
    }, 0)

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
        if (location.pathname !== '/') navigate('/')
    }

    function selectItem(tag: InternalTag) {
        setSelectedTags((prev) => {
            if (prev.some((el) => el.id === tag.id)) return prev
            return [...prev, { ...tag, mode: 'include' }]
        })
        setInputValue('')
        inputRef.current?.focus()
    }

    useEffect(() => {
        const validIds = new Set(tags.map((t) => t.id))

        setSelectedTags((current) => current.filter((tag) => validIds.has(tag.id)))
        setSearch((current) => current.filter((tag) => validIds.has(tag.id)))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags])

    return (
        <div className="flex flex-col items-center gap-2 w-full h-full px-1 pr-2">
            <div className="flex flex-col gap-2 h-full w-full p-3 overflow-hidden border border-tetsu-300/80 dark:border-tetsu-700 rounded">
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
                            No tag selected...
                        </li>
                    )}
                </ul>
            </div>

            <div className="flex w-full items-center gap-4">
                <Button
                    className={cn(
                        'flex items-center justify-center gap-1 caption font-semibold w-1/2 py-2 text-gray-800 whitespace-nowrap',
                        'rounded border border-tetsu-800',
                        'hover:bg-tetsu-700 hover:text-tetsu-100 hover:cursor-pointer',
                        'dark:border-tetsu-300 dark:text-tetsu-200 dark:hover:bg-tetsu-200 dark:hover:text-tetsu-700'
                    )}
                    onClick={() => clearSearch()}
                >
                    <MdOutlineClearAll className="w-4 h-4" />
                    CLEAR
                </Button>

                <Button
                    className={cn(
                        'flex items-center justify-center py-2 w-1/2 gap-1 caption font-semibold',
                        'rounded outline-none bg-tetsu-800 text-tetsu-100',
                        'hover:bg-aoi-800 focus:ring-2 focus:ring-aoi-400 focus:border focus:border-aoi-400',
                        'dark:bg-tetsu-200 dark:text-tetsu-700 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-200',
                        'disabled:cursor-default disabled:bg-gray-400 disabled:text-gray-100',
                        'dark:disabled:bg-gray-500 dark:disabled:text-gray-300'
                    )}
                    isDisabled={includedCount === 0}
                    onClick={onSearch}
                >
                    <MdSearch className="w-4 h-4" /> SEARCH
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
