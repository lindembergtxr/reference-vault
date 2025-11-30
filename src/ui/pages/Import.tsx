import { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'

import { ImageImport } from '../components/images/imageImport'
import { Button } from 'react-aria-components'
import { cn } from '../utils'
import { useTagsContext } from '../components/contexts/tagsCore'
import { useImageListContext } from '../components/contexts/imageListCore'

export const ImportPage = () => {
    const [images, setImages] = useState<InternalImage[]>([])
    const [index, setIndex] = useState(0)

    const { refreshImages } = useImageListContext()
    const { refreshTags } = useTagsContext()

    const refreshData = () => window.api.getStagedFiles({}).then((res) => setImages(res))

    const importData = () => window.api.importFiles().then(() => refreshData())

    const onCommit = (image: InternalImage<InternalTagNew>) => {
        window.api.commitImage(image).then((res) => {
            if (res.success) {
                refreshData()
                refreshTags()
                refreshImages()
            } else alert(`Commit failed! - ${JSON.stringify(res.error)}`)
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
                <div className="flex align-center justify-center gap-4 w-full px-4 mt-10">
                    <Button
                        className={cn(
                            'flex items-center gap-1 px-3 py-2 rounded-md caption text-xs font-medium',
                            'bg-tetsu-800 text-tetsu-100',
                            'dark:bg-tetsu-300 dark:text-tetsu-900 hover:bg-tetsu-600 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-100',
                            'disabled:bg-gray-200 disabled:text-gray-500'
                        )}
                        onClick={importData}
                    >
                        Import images
                    </Button>
                </div>
            )}
            <div className="flex flex-col px-4 py-6 h-full w-full overflow-hidden">
                <div className="h-full">
                    {images.length === 0 && (
                        <p className="font-mono text-xs text-tetsu-300 w-full text-center">
                            Import something to begin.
                        </p>
                    )}

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

                            <ImageImport
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
