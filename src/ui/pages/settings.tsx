import { Button } from 'react-aria-components'
import { cn, useConfig } from '../utils'

export const SettingsPage = () => {
    const { config } = useConfig()

    const exportDB = () => {
        window.api.exportDB().then((res) => {
            if (!res.success) alert(`Failed to export DB! - ${JSON.stringify(res.error)}`)
            else if (res.data) alert(`Database exported successfully to ${res.data.path}`)
        })
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full p-5">
            <div className="flex flex-col gap-2">
                <p className="label font-semibold dark:text-tetsu-300">
                    Destination Folder for images
                </p>

                <p className="label font-normal dark:text-tetsu-300">{config?.outputDir}</p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="label font-semibold dark:text-tetsu-300">Database</p>

                <Button
                    className={cn(
                        'flex justify-center items-center w-fit px-6 py-2 rounded caption text-xs font-medium',
                        'bg-tetsu-800 text-tetsu-100',
                        'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                        'disabled:bg-gray-200 disabled:text-gray-500'
                    )}
                    onClick={exportDB}
                >
                    Export DB
                </Button>
            </div>
        </div>
    )
}
