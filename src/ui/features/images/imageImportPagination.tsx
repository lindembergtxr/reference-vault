import { ReactNode } from 'react'
import { cn } from '../../utils'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'

export type PaginationProps = {
    disablePrev: boolean
    disableNext: boolean
    nextImage: () => void
    prevImage: () => void
}

type ImageImportPaginationProps = PaginationProps & {
    children: ReactNode
}
export function ImageImportPagination({
    children,
    disableNext,
    disablePrev,
    nextImage,
    prevImage,
}: ImageImportPaginationProps) {
    return (
        <div className="flex gap-3 items-center w-full h-full p-4">
            <button
                disabled={disablePrev}
                className={cn(
                    'rounded-full bg-aoi-900 text-aoi-100 cursor-pointer',
                    'disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-default'
                )}
                onClick={prevImage}
            >
                <MdOutlineKeyboardArrowLeft className="w-8 h-8" />
            </button>

            {children}

            <button
                disabled={disableNext}
                className={cn(
                    'rounded-full bg-aoi-900 text-aoi-100 cursor-pointer',
                    'disabled:bg-gray-400 disabled:text-gray-300 disabled:cursor-default'
                )}
                onClick={nextImage}
            >
                <MdOutlineKeyboardArrowRight className="w-8 h-8" />
            </button>
        </div>
    )
}
