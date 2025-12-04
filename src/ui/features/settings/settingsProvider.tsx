import { useEffect, useState } from 'react'

import { toastError } from '../../components/toast'

import { SettingsContext } from './settingsContext'

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<ConfigData | undefined>(undefined)
    const [destinationFolder, setFolder] = useState<string | undefined>(undefined)

    const toggleTheme = () => {
        window.api
            .setTheme(config && config.theme === 'light' ? 'dark' : 'light')
            .then((res) => setConfig(res))
            .catch((e) =>
                toastError({
                    id: 'setTheme',
                    title: 'Failed to set theme',
                    message: JSON.stringify(e),
                })
            )
    }

    const setDestinationFolder = () => {
        return window.api
            .setDestinationFolder(config?.currentWorkspace ?? '')
            .then((res) => setConfig(res))
            .catch((e) =>
                toastError({
                    id: 'setDestinationFolder',
                    title: 'Failed to set destination folder',
                    message: JSON.stringify(e),
                })
            )
    }

    function refresh() {
        window.api
            .getConfig()
            .then((res) => setConfig(res))
            .catch((e) =>
                toastError({
                    id: 'getConfig',
                    title: 'Failed to get config data',
                    message: JSON.stringify(e),
                })
            )
    }

    useEffect(() => {
        refresh()
    }, [])

    useEffect(() => {
        if (config) document.documentElement.classList.toggle('dark', config.theme === 'dark')

        setFolder(config?.workspaces.find((ws) => ws.name === config.currentWorkspace)?.outputDir)
    }, [config])

    return (
        <SettingsContext
            value={{ config, destinationFolder, refresh, toggleTheme, setDestinationFolder }}
        >
            {children}
        </SettingsContext>
    )
}
