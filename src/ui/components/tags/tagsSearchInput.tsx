import { useRef, useState } from 'react'
import { Input, Label } from 'react-aria-components'

import { parseTag } from '../../utils/tags'
import { cn } from '../../utils/classname'

type TagsSearchInputProps = {
    inputValue: string
    tags: InternalTag[]
    setInputValue: (value: string) => void
    selectTag: (index: InternalTag) => void
}
export const TagsSearchInput = ({
    inputValue,
    tags,
    selectTag,
    setInputValue,
}: TagsSearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const [highlight, setHighlight] = useState(-1)

    const selectItem = (index: number) => {
        selectTag(tags[index])
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

            if (tags.length > 0) {
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
                const next = (h + 1) % tags.length
                listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
                return next
            })
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlight((h) => {
                const next = (h - 1 + tags.length) % tags.length
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
        <div className="flex flex-col items-center gap-2 w-full h-full">
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
                {tags.length > 0 && (
                    <ul
                        ref={listRef}
                        tabIndex={-1}
                        onKeyDown={onListKeyDown}
                        className={cn(
                            'flex-1 overflow-y-auto px-2 py-2',
                            'outline-none focus:ring-2 focus:ring-aoi-400'
                        )}
                    >
                        {tags.map((tag, index) => (
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
                {tags.length === 0 && (
                    <li className="font-mono text-xs font-normal text-tetsu-300 dark:text-tetsu-500 pl-3 pt-3">
                        Type something for suggestions...
                    </li>
                )}
            </div>
        </div>
    )
}
