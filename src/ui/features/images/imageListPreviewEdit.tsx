import { useEffect, useRef, useState } from 'react'
import { Button } from 'react-aria-components'
import { MdOutlineClose, MdOutlineUndo } from 'react-icons/md'

import { cn, parseTag } from '../../utils'
import { parseCsv, parseTagToCSVString } from '../tags/tags.utils'
import { useCSVShortcuts, useTagFilter } from '../tags/tags.hooks'

import { EditableTag } from './images.types'

type ImageListPreviewEditProps = {
    currentTags: EditableTag[]
    onChangeTags: (tags: EditableTag[]) => void
    onClose: () => void
    onSubmit: () => void
}
export function ImageListPreviewEdit({
    currentTags,
    onChangeTags,
    onClose,
    onSubmit,
}: ImageListPreviewEditProps) {
    const [isAdding, setIsAdding] = useState(false)

    const listRef = useRef<HTMLUListElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const { filteredTags, inputValue, setInputValue } = useTagFilter()

    useCSVShortcuts({ ref: inputRef, text: inputValue, onChange: setInputValue })

    const csv = parseCsv(inputValue)
    const invalid = inputValue.length === 0 || csv.some((item) => item.error)

    const hasChanges = currentTags.some((tag) => tag.status !== 'original')

    const addTag = () => {
        const { franchise, name, category } = csv[0]
        const tag: EditableTag = {
            id: crypto.randomUUID(),
            name,
            category,
            franchise,
            status: 'added',
            isNew: true,
        }

        onChangeTags([...currentTags, tag])
        setInputValue('')
        setIsAdding(false)
    }

    const removeTag = (tag: EditableTag) => {
        if (tag.status === 'added') {
            onChangeTags(currentTags.filter((t) => t.id !== tag.id))
        } else if (tag.status === 'original') {
            onChangeTags(
                currentTags.map((t) => (t.id === tag.id ? { ...t, status: 'removed' } : t))
            )
        }
    }

    const undoRemoveTag = (tag: EditableTag) => {
        onChangeTags(currentTags.map((t) => (t.id === tag.id ? { ...t, status: 'original' } : t)))
    }

    const selectTag = (tag: InternalTag) => {
        setInputValue('')

        const temp = [...currentTags]

        const index = temp.findIndex((t) => t.id === tag.id)

        if (index === -1) {
            temp.push({ ...tag, status: 'added' })
            onChangeTags(temp)
        }
        setIsAdding(false)
    }

    const clearTag = () => {
        setIsAdding(false)
        setInputValue('')
    }

    useEffect(() => {
        const el = listRef.current

        if (!el) return

        requestAnimationFrame(() => (el.scrollTop = el.scrollHeight))
    }, [currentTags.length])

    return (
        <div className="flex flex-col items-center gap-3 w-full px-4 py-2 rounded border border-gray-400 mb-3">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center w-full justify-end pr-4">
                    {isAdding ? (
                        <div className="flex flex-col justify-center items-between gap-2 text-aoi-800 rounded border border-aoi-800 w-full px-1 py-1">
                            <div className="flex items-center gap-2 w-full h-full">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className={cn(
                                        'w-full rounded px-3 py-1 font-mono text-xs bg-aoi-950 text-green-400',
                                        'outline-none'
                                    )}
                                    placeholder="Type something to see sugestions..."
                                    value={inputValue}
                                    onChange={(evt) => setInputValue(evt.target.value)}
                                />

                                <div className="flex items-center gap-1">
                                    <Button
                                        className={cn(
                                            'caption text-xs bg-aoi-800 text-aoi-100 rounded w-fit px-3 py-1',
                                            'hover:bg-aoi-600 hover:text-aoi-100 hover:cursor-pointer',
                                            'disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-default'
                                        )}
                                        isDisabled={invalid}
                                        onClick={addTag}
                                    >
                                        Add
                                    </Button>

                                    <Button
                                        className={cn(
                                            'caption text-xs bg-transparent text-aoi-800 rounded w-fit px-2 py-1',
                                            'hover:bg-aoi-800 hover:text-aoi-100 hover:cursor-pointer'
                                        )}
                                        onClick={clearTag}
                                    >
                                        Discard
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col h-16 w-full overflow-hidden rounded border border-gray-400">
                                <ul className="flex flex-col min-h-0 w-full px-3 py-1 overflow-scroll">
                                    {filteredTags.map((tag) => (
                                        <li
                                            key={tag.id}
                                            className="hover:bg-gray-300 hover:text-gray-900 hover:cursor-pointer"
                                            onClick={() => selectTag(tag)}
                                        >
                                            {parseTag(tag)}
                                        </li>
                                    ))}
                                    {filteredTags.length === 0 && (
                                        <p className="font-mono text-xs">No sugestions</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <Button
                            className={cn(
                                'caption text-xs bg-transparent text-aoi-800 rounded border border-aoi-800 w-fit px-3 py-1',
                                'hover:bg-aoi-800 hover:text-aoi-100 hover:cursor-pointer'
                            )}
                            onClick={() => setIsAdding(true)}
                        >
                            Add tag
                        </Button>
                    )}
                </div>

                <div className="flex flex-col w-full max-h-[10vh] overflow-hidden">
                    <ul ref={listRef} className="flex flex-col gap-1 min-h-0 overflow-scroll pr-4">
                        {currentTags.map((tag) => (
                            <li
                                className={cn(
                                    'flex items-center justify-between w-full font-mono text-xs px-2 py-1',
                                    'rounded border border-gray-500',
                                    tag.status === 'original'
                                        ? 'bg-gray-300'
                                        : tag.status === 'removed'
                                          ? 'bg-red-200'
                                          : 'bg-green-200'
                                )}
                                key={tag.id}
                            >
                                <p className="w-full">{parseTagToCSVString(tag)}</p>
                                <p>{tag.status}</p>
                                {tag.status !== 'removed' && (
                                    <Button
                                        className="p-0.5 rounded hover:bg-red-300"
                                        onClick={() => removeTag(tag)}
                                    >
                                        <MdOutlineClose className="w-3 h-3" />
                                    </Button>
                                )}
                                {tag.status === 'removed' && (
                                    <Button
                                        className="p-0.5 rounded hover:bg-red-300"
                                        onClick={() => undoRemoveTag(tag)}
                                    >
                                        <MdOutlineUndo className="w-3 h-3" />
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
                <Button
                    className={cn(
                        'caption text-xs bg-transparent text-aoi-800 rounded border border-aoi-800 w-fit px-3 py-2',
                        'hover:bg-aoi-800 hover:text-aoi-100 hover:cursor-pointer'
                    )}
                    onClick={onClose}
                >
                    Discard changes
                </Button>

                <Button
                    className={cn(
                        'caption text-xs bg-aoi-800 text-aoi-100 rounded w-fit px-3 py-2',
                        'hover:bg-aoi-700 hover:cursor-pointer',
                        'disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-default'
                    )}
                    isDisabled={!hasChanges}
                    onClick={onSubmit}
                >
                    Save changes
                </Button>
            </div>
        </div>
    )
}
