import { useEffect, useState } from 'react'
import { ImageList } from '../components/images/ImageList'
import { ImageListContext } from '../components/contexts/imageList'
import { ImagePreview } from '../components/images/ImagePreview'

export const Import = () => {
    const [previewed, setPreviewed] = useState('')
    const [images, setImages] = useState<InternalImage[]>([])
    const [selected, setSelected] = useState<InternalImage[]>([])

    const importData = () => {
        window.api.importFiles()
    }
    const refreshData = () => {
        window.api.getStagedFiles().then((res) => setImages(res))
    }
    const commitData = () => {
        //
    }
    const openImage = (id: string) => {
        const url = images.find((image) => image.id === id)?.imagePath ?? ''

        setPreviewed(url)
    }
    const clearPreviewed = () => setPreviewed('')

    useEffect(() => {
        refreshData()
    }, [])

    return (
        <ImageListContext.Provider value={{ selected, setSelected, images, setImages, openImage }}>
            <div>
                <div className="flex justify-between align-center w-full py-4 px-4">
                    <div className="flex align-center gap-4 w-full">
                        <button
                            className="bg-gray-500 text-gray-100 rounded-full px-4 py-1"
                            onClick={importData}
                        >
                            Import
                        </button>

                        <button
                            className="bg-gray-500 text-gray-100 rounded-full px-4 py-1"
                            onClick={refreshData}
                        >
                            Refresh
                        </button>
                    </div>

                    <button
                        className="bg-green-500 text-gray-100 rounded-full px-4 py-1 disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed"
                        disabled
                        onClick={commitData}
                    >
                        Commit
                    </button>
                </div>
                <h1>Import</h1>

                <div className="flex px-8 py-6 w-full">
                    {images.length > 0 ? <ImageList /> : <p>Lista Vazia</p>}
                </div>

                {!!previewed && <ImagePreview url={previewed} closePreview={clearPreviewed} />}
            </div>
        </ImageListContext.Provider>
    )
}
