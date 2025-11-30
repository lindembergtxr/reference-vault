import { useEffect, useMemo } from 'react'

import { useTagsContext } from '../contexts/tagsCore'
import { TagsCSVInput } from './tagsCSVInput'
import { filterTagFunction, parseCsv, parseTagToCSVString } from './tags.utils'
import { CSVTag } from './tags.type'
import { useTagsCSVInput } from './tags.hooks'

type TagsInputControllerProps = {
    onTagsChange: (tags: CSVTag[]) => void
}
export const TagsInputController = ({ onTagsChange }: TagsInputControllerProps) => {
    const csvInputProps = useTagsCSVInput()

    const dirtyTags = useMemo(() => {
        return csvInputProps.parsedTags
            .filter((tag) => tag.error)
            .map((tag) => `Error in "${tag.name}" - ${tag.error}`)
    }, [csvInputProps.parsedTags])

    const { tags } = useTagsContext()

    const filteredTags = useMemo(() => {
        const csvTag = parseCsv(csvInputProps.csvText).at(-1)

        if (!csvTag || csvTag.name.length <= 1) return []

        return filterTagFunction(tags)(csvTag.name)
    }, [tags, csvInputProps.csvText])

    const addTag = (tag: InternalTag) => {
        csvInputProps.setCsvText((prev) => {
            const lines = prev.split('\n')
            lines[lines.length - 1] = parseTagToCSVString(tag) + '\n' + ''
            return lines.join('\n')
        })
        csvInputProps.ref.current?.focus()
    }

    useEffect(() => {
        onTagsChange(csvInputProps.parsedTags)
    }, [csvInputProps.parsedTags, onTagsChange])

    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            <TagsCSVInput {...csvInputProps} />

            <div className="flex flex-col flex-1 w-full mt-4 bg-tetsu-200 rounded-sm p-3 pr-0 overflow-hidden">
                <ul className="min-h-0 w-full flex flex-col gap-1 overflow-scroll">
                    {dirtyTags.length > 0 && (
                        <p className="font-mono text-sm font-semibold text-red-700/90">Errors:</p>
                    )}
                    {dirtyTags.map((error) => (
                        <li key={error} className="font-mono text-sm text-red-700/80">
                            {error}
                        </li>
                    ))}

                    {dirtyTags.length > 0 && <br />}

                    <li className="font-mono text-sm font-medium">Tag suggestions:</li>

                    {filteredTags.length === 0 && (
                        <p className="font-mono text-sm text-tetsu-700/60">
                            type something to receive tag suggestions...
                        </p>
                    )}
                    {filteredTags.map((tag) => (
                        <li
                            key={tag.id}
                            className="font-mono text-sm w-full hover:cursor-pointer hover:bg-tetsu-300"
                            onClick={() => addTag(tag)}
                        >
                            - {parseTagToCSVString(tag)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
