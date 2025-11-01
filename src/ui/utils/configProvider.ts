import { createContext, useContext } from 'react'

type ConfigContextType = {
    config: ConfigData | null
    toggleTheme: () => void
}

export const ConfigContext = createContext<ConfigContextType>({
    config: null,
    toggleTheme: () => {},
})

export const useConfig = () => useContext(ConfigContext)
