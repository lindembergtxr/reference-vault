import { useEffect, useState } from 'react'
import { ImageList } from '../components/images/ImageList'
import { ImageListContext } from '../components/contexts/imageList'
import { ImagePreview } from '../components/images/ImagePreview'
import { MdCommit, MdImportExport, MdRefresh } from 'react-icons/md'

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
            <div className="content-container">
                <div className="content-inner flex flex-col justify-between">
                    <div className="flex justify-between align-center w-full py-4 px-4">
                        <div className="flex align-center gap-4 w-full">
                            <button
                                className="flex items-center gap-1 bg-aoi-500 text-aoi-100 font-medium dark:bg-aoi-300 dark:text-aoi-900 rounded-md pl-3 pr-4 py-1"
                                onClick={importData}
                            >
                                <MdImportExport />
                                Import
                            </button>

                            <button
                                className="flex items-center gap-1 bg-aoi-500 text-aoi-100 font-medium dark:bg-aoi-300 dark:text-aoi-900 rounded-md pl-3 pr-4 py-1"
                                onClick={refreshData}
                            >
                                <MdRefresh />
                                Refresh
                            </button>
                        </div>

                        <button
                            className="flex items-center gap-1 bg-green-500 text-gray-100 rounded-md pl-3 pr-4 py-1 disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed"
                            disabled
                            onClick={commitData}
                        >
                            <MdCommit />
                            Commit
                        </button>
                    </div>
                    <h1>Import</h1>

                    <div className="flex px-8 py-6 w-full">
                        {images.length > 0 ? <ImageList /> : <p>Lista Vazia</p>}
                    </div>

                    {!!previewed && <ImagePreview url={previewed} closePreview={clearPreviewed} />}
                </div>
            </div>
        </ImageListContext.Provider>
    )
}
