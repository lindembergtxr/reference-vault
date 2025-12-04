import { Button } from 'react-aria-components'

import { cn } from '../../utils'
import { useSettings } from './settingsContext'

import { SettingsWorkspace } from './settingsWorkspace'

export function SettingsWorkspaceList() {
    const { config } = useSettings()

    function createWorkspace() {}

    return (
        <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-row items-center w-full">
                <p className="subtitle font-semibold dark:text-tetsu-300">Workspaces</p>
                <Button
                    className={cn(
                        'flex justify-center items-center w-fit px-6 py-2 rounded caption text-xs font-medium',
                        'bg-tetsu-800 text-tetsu-100 ml-auto',
                        'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                        'disabled:bg-gray-200 disabled:text-gray-500'
                    )}
                    onClick={createWorkspace}
                >
                    New workspace
                </Button>
            </div>
            <div className="flex flex-col w-full gap-2">
                {(config?.workspaces ?? []).map((ws) => (
                    <SettingsWorkspace
                        key={ws.name}
                        workspace={ws}
                        isCurrent={config?.currentWorkspace === ws.name}
                    />
                ))}
            </div>
        </div>
    )
}
