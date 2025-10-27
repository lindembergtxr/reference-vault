import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

export type ImportContextType = {
    images: InternalImage[]
    selected: InternalImage[]
    setImages: Dispatch<SetStateAction<InternalImage[]>>
    setSelected: Dispatch<SetStateAction<InternalImage[]>>
    openImage: (id: string) => void
}

export const ImageListContext = createContext<ImportContextType | undefined>(undefined)

export const useImageListContext = () => {
    const context = useContext(ImageListContext)

    if (!context) throw new Error('useImageListContext must be used within ImageListContext')
    return context
}
