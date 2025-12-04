import { createContext, useContext } from 'react'

type ConfigContextType = {
    config: ConfigData | undefined
    destinationFolder: string | undefined
    toggleTheme: () => void
    setDestinationFolder: () => Promise<void>
}

export const ConfigContext = createContext<ConfigContextType>({
    config: undefined,
    destinationFolder: undefined,
    toggleTheme: () => {},
    setDestinationFolder: () => new Promise(() => {}),
})

export const useConfig = () => useContext(ConfigContext)
