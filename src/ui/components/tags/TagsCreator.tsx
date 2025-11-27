import { useEffect, useRef, useState } from 'react'

import { cn } from '../../utils'

type ParsedTag = InternalTag & {
    id: string
    category: TagCategory
    franchise: string | null
    line: number
    error?: string
}

const defaultCSVText = 'id,category,franchise'

const CATEGORY_SHORTCUTS: Record<number, TagCategory> = {
    1: 'general',
    2: 'artist',
    3: 'character',
    4: 'copyright',
    5: 'meta',
}

const VALID_CATEGORIES = Object.values(CATEGORY_SHORTCUTS)

const parseCsv = (text: string): ParsedTag[] => {
    if (!text) return []

    const lines = text.trim().split('\n')

    return lines.map((line, index): ParsedTag => {
        const parts = line.split(',')

        const result: ParsedTag = {
            id: parts[0]?.trim() || '',
            category: parts[1]?.trim() as TagCategory,
            franchise: parts[2]?.trim() || null,
            line: index + 2,
        }

        if (!result.id) result.error = 'id required'
        else if (!VALID_CATEGORIES.includes(result.category)) result.error = 'invalid category'

        return result
    })
}

export const TagsCreator = () => {
    const [csvText, setCsvText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const parsed = parseCsv(csvText)

    const invalid = parsed.filter((p) => p.error)
    const valid = parsed.filter((p) => !p.error)

    const canImport = valid.length > 0 && invalid.length === 0 && !isLoading

    const submitTags = async () => {
        try {
            const internalTags = parseCsv(csvText).map<InternalTag>((tag) => ({
                id: tag.id,
                category: tag.category,
                franchise: tag.franchise,
            }))

            setIsLoading(true)

            await window.api.createTags(internalTags)

            setCsvText('')

            alert('Tags saved successfully!')
        } catch (error) {
            window.api.logError({ message: 'Failed to create tags', error })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const el = textareaRef.current

        if (!el) return

        const handler = (e: KeyboardEvent) => {
            if (!e.metaKey) return

            const key = Number(e.key)

            if (!CATEGORY_SHORTCUTS[key]) return

            e.preventDefault()

            const insert = ',' + CATEGORY_SHORTCUTS[key]

            const start = el.selectionStart
            const end = el.selectionEnd

            const updated = csvText.slice(0, start) + insert + csvText.slice(end)

            setCsvText(updated)

            requestAnimationFrame(() => {
                el.setSelectionRange(start + insert.length, start + insert.length)
            })
        }

        el.addEventListener('keydown', handler)

        return () => el.removeEventListener('keydown', handler)
    }, [csvText])

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between w-full">
                <div className="text-sm text-gray-300">
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                        {Object.entries(CATEGORY_SHORTCUTS).map(([k, v]) => (
                            <div
                                key={k}
                                className="flex gap-1 px-2 py-1 bg-gray-800 rounded text-xs"
                            >
                                <span>⌘{k} =</span>
                                <span>{v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    disabled={!canImport}
                    onClick={submitTags}
                    className={cn(
                        'px-4 h-8 bg-aoi-900 text-aoi-200 font-semibold caption rounded-md cursor-pointer',
                        'disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-default'
                    )}
                >
                    Import tags
                </button>
            </div>

            <div className="flex flex-1 flex-row gap-6 overflow-hidden">
                <div className="flex flex-col h-full w-full">
                    <div className="flex flex-col w-full px-3 py-2 font-mono h-full bg-black rounded-t border border-b-gray-700">
                        <span className="truncate text-green-300 text-sm">{defaultCSVText}</span>

                        <textarea
                            ref={textareaRef}
                            value={csvText}
                            onChange={(e) => setCsvText(e.target.value)}
                            className={cn(
                                'flex-1 min-h-0 mt-2 w-full resize-none p-0 font-mono text-sm bg-black text-green-300',
                                'rounded-b border-none outline-none'
                            )}
                            spellCheck={false}
                        />
                    </div>
                </div>

                <div className="w-full overflow-auto flex flex-col gap-4">
                    <table className="table-fixed w-full text-sm border-collapse">
                        <thead className="sticky top-0 bg-tetsu-100 border-b border-gray-600">
                            <tr className="text-left">
                                <th className="w-12 truncate px-2">#</th>
                                <th className="w-32 truncate px-2">ID</th>
                                <th className="w-32 truncate px-2">Category</th>
                                <th className="w-32 truncate px-2">Franchise</th>
                            </tr>
                        </thead>
                        <tbody className="overflow-scroll">
                            {parsed.map((tag) => (
                                <tr
                                    key={tag.line}
                                    className={tag.error ? 'bg-red-900/30' : 'bg-green-900/20'}
                                >
                                    <td className="truncate px-2">{tag.line - 1}</td>
                                    <td className="truncate px-2">{tag.id}</td>
                                    <td className="truncate px-2">{tag.category}</td>
                                    <td className="truncate px-2">{tag.franchise}</td>
                                </tr>
                            ))}
                            {parsed.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">
                                        No tags to show. Write tags on the editor.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
