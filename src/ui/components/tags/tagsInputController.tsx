import { useEffect, useMemo } from 'react'

import { useTagsContext } from '../contexts/tagsCore'
import { parseTag } from '../../utils'
import { TagsCSVInput } from './tagsCSVInput'
import { parseCsv, parseTagToCSVString } from './tags.utils'
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
        const currentTag = parseCsv(csvInputProps.csvText).at(-1)

        if (!currentTag || currentTag.name.length <= 1) return []

        return tags
            .map((tag) => ({
                tag,
                parsed: parseTag(tag).toLowerCase(),
                idScore: tag.name.toLowerCase().includes(currentTag.name.toLowerCase()) ? 1 : 0,
            }))
            .filter((item) =>
                item.parsed.includes(currentTag.name.replaceAll(' ', '_').toLowerCase())
            )
            .sort((a, b) => b.idScore - a.idScore)
            .map((item) => item.tag)
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

            <div className="flex flex-col flex-1 w-full mt-4 bg-tetsu-200 rounded-sm p-3 overflow-hidden">
                {dirtyTags.length > 0 && <p className="font-mono text-sm">Errors:</p>}
                {dirtyTags.map((error) => (
                    <p key={error} className="font-mono text-sm">
                        {error}
                    </p>
                ))}
                {dirtyTags.length > 0 && <br />}
                {filteredTags.length > 0 && (
                    <ul className="min-h-0 w-full flex flex-col gap-1 overflow-scroll">
                        <li className="font-mono text-sm">Tag suggestions:</li>
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
                )}
                {filteredTags.length === 0 && (
                    <p className="font-mono text-sm">
                        type something to receive tag suggestions...
                    </p>
                )}
            </div>
        </div>
    )
}
