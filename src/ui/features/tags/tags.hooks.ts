import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TagsCSVInputRef } from './tagsCSVInput'
import { CATEGORY_SHORTCUTS, filterTagFunction, parseCsv } from './tags.utils'
import { useTagsContext } from '../contexts/tagsCore'

export const useTagsCSVInput = () => {
    const [csvText, setCsvText] = useState('')

    const ref = useRef<TagsCSVInputRef>(null)

    const parsedTags = useMemo(() => parseCsv(csvText), [csvText])

    const onChange = (value: string) => {
        const lines = value.split('\n')
        let end = lines.length

        while (end > 1 && lines[end - 1] === '' && lines[end - 2] === '') end--

        const newValue = lines.slice(0, end).join('\n')

        setCsvText(newValue)
    }

    return { csvText, parsedTags, ref, onChange, setCsvText }
}

type UseCSVShortcutsArgs = {
    ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
    text: string
    onChange: (value: string) => void
}
export function useCSVShortcuts({ ref, text, onChange }: UseCSVShortcutsArgs) {
    const textRef = useRef(text)

    const handler = useCallback(
        (evt: Event) => {
            const ke = evt as unknown as KeyboardEvent

            if (!ke.metaKey) return

            const key = Number(ke.key)
            if (!Number.isFinite(key)) return

            const shortcut = CATEGORY_SHORTCUTS[key]
            if (!shortcut) return

            evt.preventDefault()

            const el = ref.current

            if (!el) return

            const text = textRef.current || ''

            const start = el.selectionStart ?? 0
            const end = el.selectionEnd ?? 0

            const before = text.slice(0, start).replace(/,\s*$/, '')
            const updated = before + ', ' + shortcut + text.slice(end)

            onChange(updated)

            requestAnimationFrame(() => {
                const pos = before.length + 2 + shortcut.length
                el.setSelectionRange(pos, pos)
            })
        },
        [ref, onChange]
    )

    useEffect(() => {
        textRef.current = text
    }, [text])

    useEffect(() => {
        const el = ref.current

        if (!el) return

        el.addEventListener('keydown', handler)

        return () => el.removeEventListener('keydown', handler)
    }, [ref, handler])
}

export function useTagFilter() {
    const [inputValue, setInputValue] = useState('')

    const { tags } = useTagsContext()

    const filteredTags = useMemo(() => filterTagFunction(tags)(inputValue), [tags, inputValue])

    return { tags, filteredTags, inputValue, setInputValue }
}
