import { useState } from 'react'
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { cn } from '../../utils/classname'

type PaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}
export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const [inputPage, setInputPage] = useState(currentPage < totalPages ? currentPage : totalPages)

    const goToPage = (page: number) => {
        const newPage = Math.max(1, Math.min(totalPages, page))

        onPageChange(newPage)
        setInputPage(newPage)
    }

    return (
        <div className="flex items-center gap-2 p-2 mt-4">
            <button
                className="px-3 h-8 bg-gray-200 rounded-md border-[1px] border-gray-700 hover:bg-gray-400 hover:cursor-pointer disabled:opacity-50"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
            >
                <MdKeyboardDoubleArrowLeft className="h-5 w-5" />
            </button>

            <button
                className="px-3 h-8 bg-gray-200 rounded-md border-[1px] border-gray-700 hover:bg-gray-400 hover:cursor-pointer disabled:opacity-50"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <MdKeyboardArrowLeft className="h-5 w-5" />
            </button>

            <span className="label mx-4">
                Page {currentPage} of {totalPages}
            </span>

            <button
                className="px-3 h-8 bg-gray-200 rounded-md border-[1px] border-gray-700 hover:bg-gray-400 hover:cursor-pointer disabled:opacity-50"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <MdKeyboardArrowRight className="h-5 w-5" />
            </button>

            <button
                className="px-3 h-8 bg-gray-200 rounded-md border-[1px] border-gray-700 hover:bg-gray-400 hover:cursor-pointer disabled:opacity-50"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                <MdKeyboardDoubleArrowRight className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1 ml-4">
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={inputPage}
                    onChange={(e) => setInputPage(Number(e.target.value))}
                    className={cn(
                        'w-16 px-2 h-8 border-[1px] caption border-gray-700/50 hover:bg-gray-100 rounded-md',
                        'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                    )}
                />
                <button
                    className={cn(
                        'px-2 h-8 bg-aoi-800 rounded-md text-white hover:bg-aoi-900',
                        'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                    )}
                    onClick={() => goToPage(inputPage)}
                >
                    GO
                </button>
            </div>
        </div>
    )
}
