import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

export type ImportContextType = {
    images: InternalImage[]
    setImages: Dispatch<SetStateAction<InternalImage[]>>
    page: number
    setPage: Dispatch<SetStateAction<number>>
    totalPages: number
    paginatedImages: InternalImage[]
}

export const Context = createContext<ImportContextType | undefined>(undefined)

export const useImageListContext = () => {
    const context = useContext(Context)

    if (!context) throw new Error('useImageListContext must be used within ImageListContext')
    return context
}
