import { Button } from 'react-aria-components'

import { cn } from '../../utils'
import { useSettings } from './settingsContext'

import { SettingsWorkspace } from './settingsWorkspace'
import { useState } from 'react'
import { SettingsWorkspaceCreate } from './settingsWorkspaceCreate'

export function SettingsWorkspaceList() {
    const [isCreating, setIsCreating] = useState(false)

    const { config, refresh } = useSettings()

    function createWorkspace() {
        setIsCreating(true)
    }

    function submit(name: string) {
        window.api.createWorkspace(name).then(() => {
            refresh()
            setIsCreating(false)
        })
    }
    function close() {
        setIsCreating(false)
    }

    return (
        <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-row items-center w-full">
                <p className="subtitle font-semibold dark:text-tetsu-300">Workspaces</p>
                <Button
                    className={cn(
                        'flex justify-center items-center w-fit px-6 py-2 rounded caption text-xs font-medium',
                        'bg-tetsu-800 text-tetsu-100 ml-auto',
                        'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                        'disabled:bg-gray-300 disabled:text-gray-600'
                    )}
                    isDisabled={isCreating}
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

                {isCreating && <SettingsWorkspaceCreate onSubmit={submit} onClose={close} />}
            </div>
        </div>
    )
}
