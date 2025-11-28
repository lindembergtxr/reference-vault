import { useMemo, useRef, useState } from 'react'

import { TagsCSVInputRef } from './tagsCSVInput'
import { parseCsv } from './tags.utils'

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
