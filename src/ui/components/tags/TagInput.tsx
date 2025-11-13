import { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { TooltipInfo } from '../common/TooltipInfo'
import { Input, Label } from 'react-aria-components'

const parseTagString = (input: string) => {
    input = input.trim()

    let franchise: string | null = null
    let tagName: string = ''

    const colonIndex = input.indexOf(':')

    if (colonIndex !== -1) {
        franchise = input.slice(0, colonIndex).trim()
        tagName = input.slice(colonIndex + 1).trim()
    } else {
        tagName = input
    }

    tagName = tagName.replace(/_+/g, ' ').trim().toLowerCase().replace(/\s+/g, '_')

    return { franchise, name: tagName }
}

export type Tag = InternalTag & {
    isNew: boolean
}
type TagsInputProps = {
    onTagsChange: (tags: InternalTag[]) => void
}
export const TagsInput = ({ onTagsChange }: TagsInputProps) => {
    const [message, setMessage] = useState('')
    const [input, setInput] = useState('')
    const [currentTags, setCurrentTags] = useState<Tag[]>([])
    const [tags, setTags] = useState<InternalTag[]>([])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            const { name, franchise } = parseTagString(input)

            const searched = currentTags.find((tag) => name === tag.id)
            const isNew = !tags.some((tag) => name === tag.id)

            if (searched) {
                setInput('')
                setMessage('This element has already been added.')
            } else {
                setCurrentTags((prev) => [...prev, { id: name, name, franchise, isNew }])
                setInput('')
                setMessage('')
            }
            e.preventDefault()
        } else if (e.key === 'Backspace') {
            if (input.length === 0) {
                setCurrentTags((prev) => prev.slice(0, -1))
                setMessage('')
                setInput('')
                e.preventDefault()
            }
        } else {
            setMessage('')
        }
    }

    const removeTag = (id: string) => {
        setCurrentTags((prev) => {
            const temp = prev.filter((tag) => tag.id !== id)
            return [...temp]
        })
        setMessage('')
    }

    useEffect(() => {
        window.api.getAllTags().then((res) => setTags(res))
    }, [])

    useEffect(() => {
        onTagsChange(currentTags)
    }, [currentTags, onTagsChange])

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row gap-1 h-6 items-center paragraph-md font-semibold">
                <Label htmlFor="tag-input">Tags</Label>

                <TooltipInfo
                    text={`<ENTER> to add. <BACKSPACE> to remove last. Green tags are new.`}
                />
            </div>

            <div className="flex flex-wrap gap-2 w-full border p-2 rounded-sm bg-white">
                {currentTags.map((tag) => (
                    <div
                        key={tag.id}
                        className={`flex items-center px-2 py-1 gap-1 rounded ${tag.isNew ? 'bg-green-200' : 'bg-gray-200'}`}
                    >
                        <span className="caption flex text-nowrap">{`${tag.franchise ? `${tag.franchise}:` : ''}${tag.name}`}</span>

                        <button onClick={() => removeTag(tag.id)}>
                            <MdClose />
                        </button>
                    </div>
                ))}
                <Input
                    id="tag-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow min-w-2 outline-none paragraph-sm h-6 w-auto"
                    placeholder={
                        input.length === 0 && currentTags.length === 0
                            ? 'Type a tag and press ENTER to add.'
                            : ''
                    }
                />
            </div>
            <p className="paragraph-sm h-4 text-red-600">{message}</p>
        </div>
    )
}
