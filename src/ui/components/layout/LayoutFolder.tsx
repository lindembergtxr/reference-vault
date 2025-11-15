import { useRef } from 'react'
import { Button } from 'react-aria-components'
import { MdOutlineFileCopy, MdOutlineFolder } from 'react-icons/md'

import { useConfig } from '../../utils/configProvider'
import { cn } from '../../utils/classname'

export const LayoutFolder = () => {
    const { config, setDestinationFolder } = useConfig()

    const buttonRef = useRef<HTMLButtonElement>(null)

    const outputDir = config?.outputDir ?? ''

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

    const copyFolderToClipboard = () => {
        if (config?.outputDir) navigator.clipboard.writeText(config?.outputDir)
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
                            'border-[1px] border-tetsu-700 rounded-md',
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
                <div className="flex flex-row gap-4 items-center justify-between w-full">
                    <p className="paragraph-md dark:text-tetsu-300 overflow-hidden text-ellipsis">
                        {formatFolder(outputDir)}
                    </p>

                    <Button
                        ref={buttonRef}
                        className={cn(
                            'flex items-center gap-2 w-fit py-1 px-2',
                            'border-[1px] border-tetsu-700 rounded-md',
                            'dark:text-tetsu-300 hover:bg-tetsu-300 dark:hover:text-tetsu-700',
                            'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                        )}
                        aria-label="Copy folder to clipboard"
                        name="Copy folder path to clipboard"
                        onClick={copyFolderToClipboard}
                    >
                        <MdOutlineFileCopy />
                    </Button>
                </div>
            )}
        </div>
    )
}
