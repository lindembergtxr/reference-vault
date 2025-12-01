import { useRef, useState } from 'react'
import { Button, Input, Label } from 'react-aria-components'
import { MdOutlineClose, MdSearch } from 'react-icons/md'

import { parseTag } from '../../utils/tags'
import { cn } from '../../utils/classname'
import { useImageListContext } from '../contexts/imageListCore'

import { useTagFilter } from './tags.hooks'

export const TagsSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const { filteredTags, inputValue, setInputValue } = useTagFilter()

    const { setSearch } = useImageListContext()

    const [selectedTags, setSelectedTags] = useState<InternalTag[]>([])
    const [highlight, setHighlight] = useState(-1)

    const removeTag = (tagId: string) => {
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId))
    }

    const clearSearch = () => {
        setSelectedTags([])
        setSearch([])
    }

    const onSearch = () => {
        setInputValue('')
        setSearch(selectedTags)
    }

    const selectItem = (index: number) => {
        setSelectedTags((prev) => {
            if (prev.some((el) => el.id === filteredTags[index].id)) return prev
            return [...prev, filteredTags[index]]
        })
        setInputValue('')
        inputRef.current?.focus()
    }

    const onInputFocus = () => {
        requestAnimationFrame(() => {
            const el = inputRef.current
            if (el) el.scrollLeft = el.scrollWidth
        })
    }

    const onInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()

            if (filteredTags.length > 0) {
                setHighlight(0)

                requestAnimationFrame(() => {
                    listRef.current?.focus()
                    listRef.current?.children[0]?.scrollIntoView({ block: 'nearest' })
                })
            }
        }
    }

    const onListKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setHighlight((h) => {
                const next = (h + 1) % filteredTags.length
                listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
                return next
            })
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlight((h) => {
                const next = (h - 1 + filteredTags.length) % filteredTags.length
                listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
                return next
            })
        }

        if (e.key === 'Enter') {
            e.preventDefault()

            if (highlight >= 0) {
                setHighlight(-1)
                setInputValue('')

                selectItem(highlight)
                inputRef.current?.focus()

                requestAnimationFrame(() => {
                    const el = inputRef.current
                    if (el) el.scrollLeft = el.scrollWidth
                })
            }
        }
        if (e.key === 'Escape') {
            setHighlight(-1)
            inputRef.current?.focus()
        }
    }

    return (
        <div className="flex flex-col items-center gap-2 w-full h-full px-1 pr-2">
            <div className="flex flex-col flex-1 gap-2 w-full p-3 overflow-hidden border border-tetsu-300/80 dark:border-tetsu-700 rounded">
                <p className="font-semibold dark:text-tetsu-300 text-sm">Selected tags</p>

                <ul className="min-h-0 overflow-scroll">
                    {selectedTags.map((searchTag) => (
                        <li
                            key={searchTag.id}
                            className="flex itens-center justify-between w-full gap-2 dark:text-tetsu-200"
                        >
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

            <div className="flex items-center w-full gap-2">
                <Label htmlFor="tag-search-input" className="w-full">
                    <Input
                        id="tag-search-input"
                        ref={inputRef}
                        className={cn(
                            'w-full paragraph-md h-8 px-4 rounded font-mono text-xs bg-black text-green-400',
                            'outline-none border border-black',
                            'hover:bg-gray-900 focus:ring focus:ring-aoi-500 focus:border-aoi-500',
                            'dark:border-black dark:hover:bg-tetsu-800'
                        )}
                        placeholder="Add tags to search"
                        value={inputValue}
                        onChange={(evt) => setInputValue(evt.target.value)}
                        onFocus={onInputFocus}
                        onKeyDown={onInputKeyDown}
                    />
                </Label>
            </div>

            <div
                className={cn(
                    'flex flex-col w-full h-[30vh] overflow-hidden',
                    'rounded border border-tetsu-300/80 dark:border-tetsu-700'
                )}
            >
                {filteredTags.length > 0 && (
                    <ul
                        ref={listRef}
                        tabIndex={-1}
                        onKeyDown={onListKeyDown}
                        className={cn(
                            'flex-1 overflow-y-auto px-2 py-2',
                            'outline-none focus:ring-2 focus:ring-aoi-400'
                        )}
                    >
                        {filteredTags.map((tag, index) => (
                            <li
                                id={tag.id}
                                key={tag.id}
                                className={cn(
                                    'hover:bg-tetsu-300/80 hover:cursor-pointer rounded label leading-8 font-normal px-2 truncate',
                                    'dark:text-tetsu-200',
                                    highlight === index
                                        ? 'bg-tetsu-300/80 dark:bg-tetsu-500/80'
                                        : ''
                                )}
                                onMouseDown={() => selectItem(index)}
                            >
                                {parseTag(tag)}
                            </li>
                        ))}
                    </ul>
                )}
                {filteredTags.length === 0 && (
                    <li className="font-mono text-xs font-normal text-tetsu-300 dark:text-tetsu-500 pl-3 pt-3">
                        Type something for suggestions...
                    </li>
                )}
            </div>
        </div>
    )
}
