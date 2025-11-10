import { createContext, useContext } from 'react'

type ConfigContextType = {
    config: ConfigData | null
    toggleTheme: () => void
    setDestinationFolder: () => Promise<void>
}

export const ConfigContext = createContext<ConfigContextType>({
    config: null,
    toggleTheme: () => {},
    setDestinationFolder: () => new Promise(() => {}),
})

export const useConfig = () => useContext(ConfigContext)
