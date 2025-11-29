import { useEffect, useState } from 'react'
import {
    MdImportExport,
    MdOutlineKeyboardArrowLeft,
    MdOutlineKeyboardArrowRight,
} from 'react-icons/md'

import { ImportImage } from '../components/import/ImportImage'
import { Button } from 'react-aria-components'
import { cn } from '../utils'
import { useTagsContext } from '../components/contexts/tagsCore'
import { useImageListContext } from '../components/contexts/imageListCore'

export const ImportPage = () => {
    const [images, setImages] = useState<InternalImage[]>([])
    const [index, setIndex] = useState(0)

    const { refreshImages } = useImageListContext()
    const { refreshTags } = useTagsContext()

    const refreshData = () => window.api.getStagedFiles().then((res) => setImages(res))

    const importData = () => window.api.importFiles()

    const onCommit = (image: InternalImage<InternalTagNew>) => {
        window.api.commitImage(image).then((res) => {
            if (res.success) {
                refreshData()
                refreshTags()
                refreshImages()
            } else alert(`Commit failed! - ${res.error}`)
        })
    }

    useEffect(() => {
        setIndex(images?.length > 0 ? 0 : -1)
    }, [images])

    useEffect(() => {
        refreshData()
    }, [])

    return (
        <div className="col-span-12 col-start-1 flex flex-col w-full h-full gap-4 pt-6">
            {images.length === 0 && (
                <div className="flex align-center gap-4 w-full px-4">
                    <Button
                        className={cn(
                            'flex items-center gap-1 pl-3 pr-4 py-2 rounded-md label font-medium',
                            'bg-aoi-500 text-aoi-100 dark:bg-aoi-300 dark:text-aoi-900',
                            'disabled:bg-gray-200 disabled:text-gray-500'
                        )}
                        onClick={importData}
                    >
                        <MdImportExport />
                        Import
                    </Button>
                </div>
            )}
            <div className="flex flex-col px-4 py-6 h-full w-full overflow-hidden">
                <div className="h-full">
                    {images.length === 0 && <p>Import something to begin.</p>}

                    {images[index] && (
                        <div className="flex gap-3 items-center w-full h-full">
                            <button
                                disabled={index === 0}
                                className={cn(
                                    'rounded-full bg-aoi-900 text-aoi-100 cursor-pointer',
                                    'disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-default'
                                )}
                                onClick={() => setIndex((i) => i - 1)}
                            >
                                <MdOutlineKeyboardArrowLeft className="w-8 h-8" />
                            </button>

                            <ImportImage
                                key={images[index].id}
                                image={images[index]}
                                onCommit={onCommit}
                            />

                            <button
                                disabled={index === images.length - 1}
                                className={cn(
                                    'rounded-full bg-aoi-900 text-aoi-100 cursor-pointer',
                                    'disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-default'
                                )}
                                onClick={() => setIndex((i) => i + 1)}
                            >
                                <MdOutlineKeyboardArrowRight className="w-8 h-8" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
