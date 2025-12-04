import { useRef } from 'react'
import { Button } from 'react-aria-components'
import { MdOutlineFolder } from 'react-icons/md'

import { useConfig } from '../contexts/configCore'
import { cn } from '../../utils/classname'

export const LayoutFolder = () => {
    const { config, setDestinationFolder } = useConfig()

    const buttonRef = useRef<HTMLButtonElement>(null)

    const outputDir =
        config?.workspaces.find((ws) => {
            return ws.name === config?.currentWorkspace
        })?.outputDir ?? null

    const formatFolder = (folder: string) => {
        const elements = folder.split('/')

        if (elements.length === 0) return null
        if (elements.length === 1) return folder

        return `.../${elements.slice(-2).join('/')}`
    }

    const selectFolder = () => {
        buttonRef.current?.setAttribute('isDisabled', 'true')

        setDestinationFolder().finally(() => {
            buttonRef.current?.setAttribute('isDisabled', 'false')
        })
    }

    return (
        <div className="flex flex-col gap-2 px-4 py-4 border-b-2 border-tetsu-500/30">
            <p className="label font-semibold dark:text-tetsu-300">Destination Folder</p>

            {!outputDir && (
                <div className="flex flex-row items-center justify-between w-full">
                    <p className="paragraph-sm dark:text-tetsu-300">Select a folder to begin.</p>

                    <Button
                        ref={buttonRef}
                        className={cn(
                            'flex items-center gap-2 w-fit py-1 px-2',
                            'border border-tetsu-700 rounded',
                            'dark:text-tetsu-300 hover:bg-tetsu-300 dark:hover:text-tetsu-700'
                        )}
                        aria-label="Select folder"
                        name="Select folder"
                        onClick={selectFolder}
                    >
                        <MdOutlineFolder />
                    </Button>
                </div>
            )}

            {!!outputDir && (
                <p className="paragraph-md dark:text-tetsu-300 overflow-hidden text-ellipsis">
                    {formatFolder(outputDir)}
                </p>
            )}
        </div>
    )
}
