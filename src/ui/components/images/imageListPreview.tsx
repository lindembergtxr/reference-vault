import { Button } from 'react-aria-components'
import { cn } from '../../utils'
import { ImagePreview } from './imagePreview'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { ImageListPreviewDetails } from './imageListPreviewDetails'

type ImageListPreviewProps = {
    preview: InternalImage
    disablePrev: boolean
    disableNext: boolean
    nextImage: () => void
    prevImage: () => void
    closePreview: () => void
}
export function ImageListPreview({
    preview,
    disableNext,
    disablePrev,
    nextImage,
    prevImage,
    closePreview,
}: ImageListPreviewProps) {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col w-full h-full gap-2">
                <div className="flex items-center h-full w-full gap-4 px-2">
                    <Button
                        className={cn(
                            'rounded-full p-1 bg-aoi-800 text-aoi-100 hover:cursor-pointer ',
                            'disabled:bg-gray-400 disabled:text-gray-100 disabled:hover:cursor-default'
                        )}
                        isDisabled={disablePrev}
                        onClick={prevImage}
                    >
                        <MdOutlineKeyboardArrowLeft className="h-6 w-6" />
                    </Button>

                    <div className="flex flex-col flex-1 gap-2 h-full">
                        <div className={`flex-1 transition-[flex-grow] duration-300 ease-in-out`}>
                            <ImagePreview image={preview} closePreview={closePreview} />
                        </div>

                        <div className={`transition-all duration-300 ease-in-out`}>
                            <ImageListPreviewDetails image={preview} />
                        </div>
                    </div>

                    <Button
                        className={cn(
                            'rounded-full p-1 bg-aoi-800 text-aoi-100 hover:cursor-pointer ',
                            'disabled:bg-gray-400 disabled:text-gray-100 disabled:hover:cursor-default'
                        )}
                        isDisabled={disableNext}
                        onClick={nextImage}
                    >
                        <MdOutlineKeyboardArrowRight className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
