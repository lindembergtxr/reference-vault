import { Button } from 'react-aria-components'
import { cn } from '../../utils'

type ImageImportEmptyProps = {
    importData: () => void
}
export function ImageImportEmpty({ importData }: ImageImportEmptyProps) {
    return (
        <div className="col-span-12 col-start-1 flex flex-col w-full h-full items-center gap-8 pt-12">
            <Button
                className={cn(
                    'flex justify-center items-center w-fit px-6 py-2 rounded-md caption text-xs font-medium',
                    'bg-tetsu-800 text-tetsu-100',
                    'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                    'disabled:bg-gray-200 disabled:text-gray-500'
                )}
                onClick={importData}
            >
                Import images
            </Button>

            <p className="font-mono text-xs text-tetsu-300 text-center">
                Import something to begin.
            </p>
        </div>
    )
}
