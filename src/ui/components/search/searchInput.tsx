import { useMemo, useRef, useState } from 'react'
import { Button, Input, Label } from 'react-aria-components'
import { MdSearch } from 'react-icons/md'
import { parseTag } from '../../utils/tags'
import { cn } from '../../utils/classname'
import { useTagsContext } from '../contexts/tagsCore'

export const SearchInput = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const { tags } = useTagsContext()

    const [search, setSearch] = useState('')
    const [highlight, setHighlight] = useState(-1)
    const [erasing, setErasing] = useState(false)

    const words = search.trimStart().split(/\s+/)
    const lastWord = words.at(-1) ?? ''

    const filteredItems = useMemo(() => {
        if (lastWord.length < 2) return []

        const lowerWord = lastWord.toLowerCase()

        return tags
            .map((tag) => ({
                tag,
                parsed: parseTag(tag).toLowerCase(),
                idScore: tag.id.toLowerCase().includes(lowerWord) ? 1 : 0,
            }))
            .filter((item) => item.parsed.includes(lowerWord))
            .sort((a, b) => b.idScore - a.idScore)
            .map((item) => item.tag)
    }, [tags, lastWord])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setHighlight(-1)
    }

    const onSearch = () => {
        console.log(search, 'search')
    }

    const selectItem = (index: number) => {
        const newWords = search.trimStart().split(/\s+/)
        newWords[newWords.length - 1] = parseTag(filteredItems[index])

        setSearch(newWords.join(' ') + ' ')
    }

    const onInputFocus = () => {
        requestAnimationFrame(() => {
            const el = inputRef.current
            if (el) el.scrollLeft = el.scrollWidth
        })
    }

    const onInputKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace') setErasing(false)
    }

    const onInputKeyDown = (e: React.KeyboardEvent) => {
        setErasing(e.key === 'Backspace')

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
        <div className="flex flex-col items-center gap-2 w-full px-1 pr-2">
            <div className="flex items-center w-full gap-2">
                <Label htmlFor="tag-search-input" className="w-full">
                    <Input
                        id="tag-search-input"
                        ref={inputRef}
                        className="w-full paragraph-md h-8 px-2 rounded-md outline-none focus:ring-2 focus:ring-aoi-400 focus:border-[1px] focus:border-aoi-400"
                        placeholder="Add tags to search"
                        value={search}
                        onFocus={onInputFocus}
                        onChange={onInputChange}
                        onKeyDown={onInputKeyDown}
                        onKeyUp={onInputKeyUp}
                    />
                </Label>
                <Button
                    className={cn(
                        'flex items-center justify-center w-12 h-8 gap-1 bg-aoi-800 text-aoi-50 paragraph-sm rounded-md',
                        'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-[1px] focus:border-aoi-400'
                    )}
                    onClick={onSearch}
                >
                    <MdSearch size={16} />
                </Button>
            </div>

            <div className="relative flex w-full h-[15vh] border-[1px] border-tetsu-300/80 rounded-md">
                {!erasing && filteredItems.length > 0 && (
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
                                id={`tag_id_${parseTag(tag)}`}
                                key={parseTag(tag)}
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
        </div>
    )
}
