import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

export type ImportContextType = {
    tags: InternalTag[]
    setTags: Dispatch<SetStateAction<InternalTag[]>>
    refreshTags: () => void
}

export const Context = createContext<ImportContextType | undefined>(undefined)

export const useTagsContext = () => {
    const context = useContext(Context)

    if (!context) throw new Error('useTagsContext must be used within TagsContext')
    return context
}
