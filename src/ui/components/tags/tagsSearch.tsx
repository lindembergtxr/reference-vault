import { useMemo, useRef, useState } from 'react'
import { Button, Input, Label } from 'react-aria-components'
import { MdOutlineClose, MdSearch } from 'react-icons/md'
import { parseTag } from '../../utils/tags'
import { cn } from '../../utils/classname'
import { useTagsContext } from '../contexts/tagsCore'
import { useImageListContext } from '../contexts/imageListCore'

export const TagsSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const { tags } = useTagsContext()
    const { setSearch } = useImageListContext()

    const [inputValue, setInputValue] = useState('')
    const [selectedTags, setSelectedTags] = useState<InternalTag[]>([])
    const [highlight, setHighlight] = useState(-1)

    const filteredItems = useMemo(() => {
        if (!inputValue || inputValue.length < 2) return []

        const lowerInput = inputValue.toLowerCase()

        return tags
            .map((tag) => {
                const nameScore = tag.name.toLowerCase().includes(lowerInput) ? 2 : 0
                const franchiseScore = tag.franchise?.toLowerCase().includes(lowerInput) ? 1 : 0
                const totalScore = nameScore + franchiseScore

                return { tag, score: totalScore }
            })
            .filter((item) => item.score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score
                return a.tag.name.localeCompare(b.tag.name)
            })
            .map((item) => item.tag)
    }, [tags, inputValue])

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
            if (prev.some((el) => el.id === filteredItems[index].id)) return prev
            return [...prev, filteredItems[index]]
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

            if (filteredItems.length > 0) {
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
                const next = (h + 1) % filteredItems.length
                listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
                return next
            })
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlight((h) => {
                const next = (h - 1 + filteredItems.length) % filteredItems.length
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
            <div className="flex flex-col flex-1 gap-2 w-full p-3 overflow-hidden border-[1px] border-tetsu-300/80 dark:border-tetsu-700 rounded-md">
                <div className="w-full flex items-center justify-between">
                    <p className="font-semibold dark:text-tetsu-300 text-sm">Selected tags:</p>
                    <Button
                        className={cn(
                            'caption font-semibold px-3 h-6 text-gray-800 rounded-md',
                            'hover:bg-tetsu-300 hover:cursor-pointer',
                            'dark:text-tetsu-300 dark:hover:bg-tetsu-800'
                        )}
                        onClick={() => clearSearch()}
                    >
                        CLEAR SEARCH
                    </Button>
                </div>
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

            <Button
                className={cn(
                    'flex items-center justify-center w-full h-8 gap-1 bg-aoi-800 text-aoi-50 paragraph-sm rounded-md',
                    'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-[1px] focus:border-aoi-400',
                    'dark:bg-tetsu-400 dark:text-tetsu-900 dark:font-semibold'
                )}
                onClick={onSearch}
            >
                <MdSearch size={16} /> SEARCH
            </Button>

            <div className="flex items-center w-full gap-2">
                <Label htmlFor="tag-search-input" className="w-full">
                    <Input
                        id="tag-search-input"
                        ref={inputRef}
                        className={cn(
                            'w-full paragraph-md h-8 px-4 rounded-md font-mono text-xs bg-tetsu-200 text-tetsu-800',
                            'outline-none border border-tetsu-300',
                            'dark:bg-black dark:text-green-400 dark:border-black',
                            'focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
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
                    'rounded-md border border-tetsu-300/80 dark:border-tetsu-700'
                )}
            >
                {filteredItems.length > 0 && (
                    <ul
                        ref={listRef}
                        tabIndex={-1}
                        onKeyDown={onListKeyDown}
                        className={cn(
                            'flex-1 overflow-y-auto px-2 py-2',
                            'outline-none focus:ring-2 focus:ring-aoi-400'
                        )}
                    >
                        {filteredItems.map((tag, index) => (
                            <li
                                id={tag.id}
                                key={tag.id}
                                className={cn(
                                    'hover:bg-tetsu-300/80 hover:cursor-pointer rounded-sm label leading-8 font-normal px-2 truncate',
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
                {filteredItems.length === 0 && (
                    <li className="font-mono text-xs font-normal text-tetsu-300 dark:text-tetsu-500 pl-3 pt-3">
                        Type something for suggestions...
                    </li>
                )}
            </div>
        </div>
    )
}
