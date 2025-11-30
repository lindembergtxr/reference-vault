import { useEffect, useMemo, useRef, useState } from 'react'

import { TagsCSVInputRef } from './tagsCSVInput'
import { CATEGORY_SHORTCUTS, parseCsv } from './tags.utils'

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
    useEffect(() => {
        const el = ref.current

        if (!el) return

        const handler = (evt: Event) => {
            const ke = evt as unknown as KeyboardEvent

            if (!ke.metaKey) return

            const key = Number(ke.key)
            if (!Number.isFinite(key)) return

            const shortcut = CATEGORY_SHORTCUTS[key]
            if (!shortcut) return

            evt.preventDefault()

            const insert = ', ' + shortcut
            const start = el.selectionStart ?? 0
            const end = el.selectionEnd ?? 0

            const updated = text.slice(0, start) + insert + text.slice(end)
            onChange(updated)

            requestAnimationFrame(() => {
                el.setSelectionRange(start + insert.length, start + insert.length)
            })
        }

        el.addEventListener('keydown', handler)

        return () => el.removeEventListener('keydown', handler)
    }, [ref, text, onChange])
}
