import { createContext, useContext } from 'react'

type SettingsContextType = {
    config: ConfigData | undefined
    destinationFolder: string | undefined
    toggleTheme: () => void
    setDestinationFolder: () => Promise<void>
}

export const SettingsContext = createContext<SettingsContextType>({
    config: undefined,
    destinationFolder: undefined,
    toggleTheme: () => {},
    setDestinationFolder: () => new Promise(() => {}),
})

export const useSettings = () => {
    const context = useContext(SettingsContext)

    if (!context) throw new Error('useSettings must be used within a SettingsProvider')

    return context
}
