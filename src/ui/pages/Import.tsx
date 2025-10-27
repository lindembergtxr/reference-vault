import { useEffect, useState } from 'react'
import { ImageList } from '../components/images/ImageList'

export const Import = () => {
    const [files, setFiles] = useState<InternalImage[]>([])

    const importData = () => {
        window.api.importFiles()
    }
    const refreshData = () => {
        window.api.getStagedFiles().then((res) => setFiles(res))
    }
    const commitData = () => {
        //
    }

    useEffect(() => {
        refreshData()
    }, [])

    return (
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
                {files.length > 0 ? <ImageList images={files} /> : <p>Lista Vazia</p>}
            </div>
        </div>
    )
}
