import { Button } from 'react-aria-components'

import { cn } from '../../utils'
import { useTagsContext } from '../contexts/tagsCore'
import { toastError, toastSuccess } from '../../components/toast'

import { useSettings } from './settingsContext'

type SettingsWorkspaceProps = {
    workspace: Workspace
    isCurrent: boolean
}
export function SettingsWorkspace({ workspace, isCurrent }: SettingsWorkspaceProps) {
    const { refresh } = useSettings()
    const { refreshTags } = useTagsContext()

    function exportDB() {
        window.api.exportDB(workspace.name).then((res) => {
            if (!res.success) alert(`Failed to export DB! - ${JSON.stringify(res.error)}`)
            else if (res.data) alert(`Database exported successfully to ${res.data.path}`)
        })
    }
    function selectFolder() {
        window.api
            .setDestinationFolder(workspace.name)
            .then(() => {
                refresh()
                refreshTags()
                toastSuccess({
                    id: 'setDestinationFolder-success',
                    title: 'Destination folder set successfully!',
                })
            })
            .catch((e) =>
                toastError({
                    id: 'setDestinationFolder-error',
                    title: 'Setting the destination folder failed.',
                    message: JSON.stringify(e),
                })
            )
    }

    function selectWorkspace() {
        window.api
            .selectWorkspace(workspace.name)
            .then(() => {
                refresh()
                refreshTags()
                toastSuccess({
                    id: 'selectWorkspace-success',
                    title: 'Workspace selected successfully!',
                })
            })
            .catch((e) =>
                toastError({
                    id: 'selectWorkspace-error',
                    title: 'Selecting the workspace failed.',
                    message: JSON.stringify(e),
                })
            )
    }

    return (
        <div className="flex flex-col w-full gap-1 rounded border border-tetsu-300 px-5 py-3">
            <div className="flex items-center justify-between w-full h-7">
                <p className="label dark:text-tetsu-300">
                    <strong>Name: </strong>
                    {workspace.name}
                </p>

                {isCurrent && (
                    <p
                        className={cn(
                            'flex items-center label text-xs font-semibold px-3 h-full rounded border',
                            'text-orange-700 border-orange-700',
                            'dark:text-orange-300 dark:border-orange-300'
                        )}
                    >
                        CURRENT
                    </p>
                )}
            </div>

            <p className="flex gap-3 label dark:text-tetsu-300 w-full">
                <strong className="text-nowrap leading-5">Destination folder: </strong>
                <span
                    className={cn(
                        'font-normal font-mono break-words flex-1 min-w-0 leading-5',
                        workspace.outputDir ? 'text-black' : 'text-gray-400'
                    )}
                >
                    {workspace.outputDir ?? 'No folder selected'}
                </span>
            </p>

            <div className="flex gap-2 mt-5 w-full">
                <Button
                    className={cn(
                        'flex items-center justify-center gap-1 caption font-semibold px-4 py-2 text-gray-800 whitespace-nowrap',
                        'rounded border border-tetsu-800',
                        'hover:bg-tetsu-700 hover:text-tetsu-100 hover:cursor-pointer',
                        'dark:border-tetsu-300 dark:text-tetsu-200 dark:hover:bg-tetsu-200 dark:hover:text-tetsu-700'
                    )}
                    onClick={exportDB}
                >
                    Export DB
                </Button>

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

                {!workspace.outputDir && (
                    <Button
                        className={cn(
                            'flex justify-center items-center w-fit px-4 py-2 rounded caption text-xs font-medium',
                            'bg-tetsu-800 text-tetsu-100',
                            'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                            'disabled:bg-gray-200 disabled:text-gray-500'
                        )}
                        onClick={selectFolder}
                    >
                        Select folder
                    </Button>
                )}
            </div>
        </div>
    )
}
