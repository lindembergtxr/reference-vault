import { useEffect, useState } from 'react'

import { ConfigContext } from '../utils/configProvider'

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<ConfigData | null>(null)

    useEffect(() => {
        window.api.getConfig().then((res) => setConfig(res))
    }, [])

    useEffect(() => {
        if (config) {
            document.documentElement.classList.toggle('dark', config.theme === 'dark')
        }
    }, [config])

    const toggleTheme = () => {
        const next = config && config.theme === 'light' ? 'dark' : 'light'

        window.api.setTheme(next).then((res) => setConfig(res))
    }

    return (
        <ConfigContext.Provider value={{ config, toggleTheme }}>{children}</ConfigContext.Provider>
    )
}
