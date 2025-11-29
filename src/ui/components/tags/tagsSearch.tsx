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
        setSelectedTags((prev) => [...prev, filteredItems[index]])

        if (inputRef.current) {
            inputRef.current.value = ''
            inputRef.current.focus()
        }
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
                const next = Math.min(h + 1, filteredItems.length - 1)
                listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
                return next
            })
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlight((h) => {
                const next = Math.max(h - 1, 0)
                listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
                return next
            })
        }

        if (e.key === 'Enter') {
            e.preventDefault()

            if (highlight >= 0) {
                selectItem(highlight)
                setHighlight(-1)
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
            <div className="flex items-center w-full gap-2">
                <Label htmlFor="tag-search-input" className="w-full">
                    <Input
                        id="tag-search-input"
                        ref={inputRef}
                        className="w-full paragraph-md h-8 px-2 rounded-md outline-none focus:ring-2 focus:ring-aoi-400 focus:border-[1px] focus:border-aoi-400"
                        placeholder="Add tags to search"
                        value={inputValue}
                        onChange={(evt) => setInputValue(evt.target.value)}
                        onFocus={onInputFocus}
                        onKeyDown={onInputKeyDown}
                    />
                </Label>
            </div>

            <div className="relative flex w-full h-[30vh] border-[1px] border-tetsu-300/80 rounded-md">
                {filteredItems.length > 0 && (
                    <ul
                        ref={listRef}
                        tabIndex={0}
                        onKeyDown={onListKeyDown}
                        className={cn(
                            'absolute top-0 left-0 flex flex-col px-2 py-2 h-full w-full rounded-md overflow-scroll',
                            'outline-none focus:ring-2 focus:ring-aoi-400'
                        )}
                    >
                        {filteredItems.map((tag, index) => (
                            <li
                                id={tag.id}
                                key={tag.id}
                                className={cn(
                                    'hover:bg-tetsu-300/80 hover:cursor-pointer label leading-6 font-normal px-2',
                                    highlight === index ? 'bg-tetsu-300/80' : ''
                                )}
                                onMouseDown={() => selectItem(index)}
                            >
                                {parseTag(tag)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex flex-col flex-1 gap-2 w-full p-3 overflow-hidden border-[1px] border-tetsu-300/80 rounded-md">
                <div className="w-full flex items-center justify-between">
                    <p className="font-semibold text-sm">Selected tags:</p>
                    <Button
                        className="caption font-semibold px-3 h-6 text-gray-800 hover:bg-tetsu-300 rounded-md hover:cursor-pointer"
                        onClick={() => clearSearch()}
                    >
                        CLEAR SEARCH
                    </Button>
                </div>
                <ul className="min-h-0 overflow-scroll">
                    {selectedTags.map((searchTag) => (
                        <li
                            key={searchTag.id}
                            className="flex itens-center justify-between w-full gap-2"
                        >
                            {parseTag(searchTag)}
                            <Button onClick={() => removeTag(searchTag.id)}>
                                <MdOutlineClose className="w-5 h-5" />
                            </Button>
                        </li>
                    ))}
                    {selectedTags.length === 0 && (
                        <li className="font-mono text-xs font-normal text-tetsu-300">
                            No tag selected to search...
                        </li>
                    )}
                </ul>
            </div>

            <Button
                className={cn(
                    'flex items-center justify-center w-full h-8 gap-1 bg-aoi-800 text-aoi-50 paragraph-sm rounded-md',
                    'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-[1px] focus:border-aoi-400'
                )}
                onClick={onSearch}
            >
                <MdSearch size={16} /> Search
            </Button>
        </div>
    )
}
