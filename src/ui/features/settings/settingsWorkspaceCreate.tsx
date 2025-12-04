import { useState } from 'react'
import { Button } from 'react-aria-components'

import { cn } from '../../utils'
import { MdOutlineClose } from 'react-icons/md'

type SettingsWorkspaceCreateProps = {
    onClose: () => void
    onSubmit: (value: string) => void
}
export function SettingsWorkspaceCreate({ onSubmit, onClose }: SettingsWorkspaceCreateProps) {
    const [inputValue, setInputValue] = useState('')

    function submit() {
        onSubmit(inputValue.trim())
    }

    return (
        <div className="flex flex-col w-full gap-2 rounded border border-tetsu-300 px-5 pb-3 pt-2">
            <div className="flex items-end justify-between w-full h-7">
                <label htmlFor="new-workspace-input" className="label">
                    Name
                </label>

                <button
                    className={cn(
                        'flex items-center justify-center h-7 w-7 text-gray-800',
                        'rounded-full outline-none border-none',
                        'hover:bg-tetsu-700 hover:text-tetsu-100 hover:cursor-pointer',
                        'dark:text-tetsu-200 dark:hover:bg-tetsu-200 dark:hover:text-tetsu-700'
                    )}
                    onClick={onClose}
                >
                    <MdOutlineClose className="w-5 h-5" />
                </button>
            </div>

            <div className="flex w-full gap-2">
                <div className="flex items-center justify-between w-full">
                    <input
                        id="new-workspace-input"
                        type="text"
                        className={cn(
                            'w-full rounded px-4 py-2 font-mono text-xs bg-aoi-950 text-green-400',
                            'outline-none'
                        )}
                        placeholder="Add a name to the workspace..."
                        value={inputValue}
                        onChange={(evt) => setInputValue(evt.target.value)}
                    />
                </div>

                <Button
                    type="submit"
                    className={cn(
                        'flex justify-center items-center w-fit px-4 py-2 rounded caption text-xs font-medium truncate',
                        'bg-tetsu-800 text-tetsu-100',
                        'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                        'disabled:bg-gray-300 disabled:text-gray-600'
                    )}
                    isDisabled={inputValue.trim().length === 0}
                    onClick={submit}
                >
                    Create workspace
                </Button>
            </div>
        </div>
    )
}
