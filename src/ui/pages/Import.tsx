import { useEffect, useState } from 'react'
import { MdImportExport } from 'react-icons/md'

import { ImportImage } from '../components/import/ImportImage'
import { Button } from 'react-aria-components'

export const ImportPage = () => {
    const [images, setImages] = useState<InternalImage[]>([])

    const importData = () => {
        window.api.importFiles()
    }
    const refreshData = () => {
        window.api.getStagedFiles().then((res) => setImages(res))
    }

    useEffect(() => {
        refreshData()
    }, [])

    return (
        <div className="col-span-12 col-start-1 flex flex-col w-full gap-4 py-6">
            <div className="flex align-center gap-4 w-full px-4">
                <Button
                    className="flex items-center gap-1 label bg-aoi-500 text-aoi-100 font-medium dark:bg-aoi-300 dark:text-aoi-900 disabled:bg-gray-200 disabled:text-gray-500 rounded-md pl-3 pr-4 py-1"
                    isDisabled={images.length > 0}
                    onClick={importData}
                >
                    <MdImportExport />
                    Import
                </Button>
            </div>
            <div className="flex flex-col px-4 py-6 w-full">
                {images.length > 0 ? (
                    images.map((image) => (
                        <ImportImage key={image.id} image={image} onCommit={refreshData} />
                    ))
                ) : (
                    <p>Import something to begin.</p>
                )}
            </div>
        </div>
    )
}
