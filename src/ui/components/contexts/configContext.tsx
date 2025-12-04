import { useEffect, useMemo, useState } from 'react'

import { ConfigContext } from './configCore'

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<ConfigData | undefined>(undefined)

    const destinationFolder = useMemo(() => {
        return config?.workspaces.find((ws) => ws.name === config.currentWorkspace)?.outputDir
    }, [config])

    const toggleTheme = () => {
        window.api
            .setTheme(config && config.theme === 'light' ? 'dark' : 'light')
            .then((res) => setConfig(res))
            .catch((e) => alert(JSON.stringify(e)))
    }

    const setDestinationFolder = () => {
        return window.api
            .setDestinationFolder(config?.currentWorkspace ?? '')
            .then((res) => setConfig(res))
            .catch((e) => alert(JSON.stringify(e)))
    }

    useEffect(() => {
        window.api
            .getConfig()
            .then((res) => setConfig(res))
            .catch((e) => alert(JSON.stringify(e)))
    }, [])

    useEffect(() => {
        if (config) document.documentElement.classList.toggle('dark', config.theme === 'dark')
    }, [config])

    return (
        <ConfigContext.Provider
            value={{ config, destinationFolder, toggleTheme, setDestinationFolder }}
        >
            {children}
        </ConfigContext.Provider>
    )
}
