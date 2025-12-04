import { Button } from 'react-aria-components'
import { cn } from '../../utils'

type SettingsWorkspaceProps = {
    workspace: Workspace
    isCurrent: boolean
}
export function SettingsWorkspace({ workspace, isCurrent }: SettingsWorkspaceProps) {
    function exportDB() {
        window.api.exportDB(workspace.name).then((res) => {
            if (!res.success) alert(`Failed to export DB! - ${JSON.stringify(res.error)}`)
            else if (res.data) alert(`Database exported successfully to ${res.data.path}`)
        })
    }
    function selectWorkspace() {}

    return (
        <div className="flex flex-col w-full gap-1 rounded border border-tetsu-300 px-5 py-3">
            <div className="flex items-center justify-between w-full">
                <p className="label dark:text-tetsu-300">
                    <strong>Name: </strong>
                    {workspace.name}
                </p>

                {isCurrent && (
                    <p
                        className={cn(
                            'label text-xs font-semibold px-3 py-1 rounded border',
                            'text-orange-700 border-orange-700',
                            'dark:text-orange-300 dark:border-orange-300'
                        )}
                    >
                        CURRENT
                    </p>
                )}
            </div>

            <p className="label dark:text-tetsu-300">
                <strong>Destination folder: </strong>
                {workspace.outputDir}
            </p>

            <div className="flex gap-2 mt-5 w-full">
                <Button
                    className={cn(
                        'flex justify-center items-center w-fit px-4 py-2 rounded caption text-xs font-medium',
                        'bg-tetsu-800 text-tetsu-100',
                        'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                        'disabled:bg-gray-200 disabled:text-gray-500'
                    )}
                    isDisabled={isCurrent}
                    onClick={selectWorkspace}
                >
                    Select workspace
                </Button>

                <Button
                    className={cn(
                        'flex justify-center items-center w-fit px-4 py-2 rounded caption text-xs font-medium',
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
