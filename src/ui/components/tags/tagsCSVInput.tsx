import { forwardRef, useImperativeHandle, useRef } from 'react'

import { cn } from '../../utils'
import { TagsCSVInputShortcuts } from './tagsCSVInputShortcuts'
import { useCSVShortcuts } from './tags.hooks'

type TagsCSVInputProps = {
    csvText: string
    onChange: (value: string) => void
}
export type TagsCSVInputRef = {
    focus: () => void
}
export const TagsCSVInput = forwardRef<TagsCSVInputRef, TagsCSVInputProps>(
    ({ csvText, onChange }, ref) => {
        const textareaRef = useRef<HTMLTextAreaElement | null>(null)

        useCSVShortcuts({ ref: textareaRef, text: csvText, onChange })

        useImperativeHandle(ref, () => ({
            focus: () => {
                if (textareaRef.current) {
                    textareaRef.current.focus()
                    textareaRef.current.scrollTop = textareaRef.current.scrollHeight
                }
            },
        }))

        return (
            <div className="flex flex-col gap-2 w-full">
                <TagsCSVInputShortcuts />
                <div className="flex flex-col h-full w-full">
                    <div className="flex flex-col w-full px-3 py-2 font-mono h-full bg-black rounded-t border border-b-gray-700">
                        <span className="truncate text-green-300 text-sm">
                            name,category,franchise
                        </span>

                        <textarea
                            ref={textareaRef}
                            value={csvText}
                            onChange={(e) => onChange(e.target.value)}
                            className={cn(
                                'flex-1 min-h-20 mt-2 w-full resize-none p-0 font-mono text-sm bg-black text-green-300',
                                'rounded-b border-none outline-none'
                            )}
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
        )
    }
)
