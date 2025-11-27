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
    const total = totalPages || 1

    const [inputPage, setInputPage] = useState(currentPage < total ? currentPage : total)

    const goToPage = (page: number) => {
        const newPage = Math.max(1, Math.min(total, page))

        onPageChange(newPage)
        setInputPage(newPage)
    }

    return (
        <div className="flex items-center gap-2 p-2">
            <button
                className={cn(
                    'px-3 h-8 bg-gray-200 rounded-md border-[1px] border-gray-700',
                    'hover:bg-gray-400 hover:cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:bg-gray-200'
                )}
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
            >
                <MdKeyboardDoubleArrowLeft className="h-5 w-5" />
            </button>

            <button
                className={cn(
                    'px-3 h-8 bg-gray-200 rounded-md border-[1px] border-gray-700',
                    'hover:bg-gray-400 hover:cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:bg-gray-200'
                )}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <MdKeyboardArrowLeft className="h-5 w-5" />
            </button>

            <span className="label mx-4">
                {currentPage} / {total}
            </span>

            <button
                className={cn(
                    'px-3 h-8 bg-gray-200 rounded-md border-[1px] border-gray-700',
                    'hover:bg-gray-400 hover:cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:bg-gray-200'
                )}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === total}
            >
                <MdKeyboardArrowRight className="h-5 w-5" />
            </button>

            <button
                className={cn(
                    'px-3 h-8 bg-gray-200 rounded-md border-[1px] border-gray-700',
                    'hover:bg-gray-400 hover:cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:bg-gray-200'
                )}
                onClick={() => goToPage(total)}
                disabled={currentPage === total}
            >
                <MdKeyboardDoubleArrowRight className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1 ml-4">
                <input
                    type="number"
                    min={1}
                    max={total}
                    value={inputPage}
                    onChange={(e) => setInputPage(Number(e.target.value))}
                    disabled={total === 1}
                    className={cn(
                        'w-16 px-2 h-8 border-[1px] caption border-gray-700/50 :not(:disabled)hover:bg-gray-100 rounded-md',
                        'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400'
                    )}
                />
                <button
                    className={cn(
                        'px-2 h-8 bg-aoi-800 rounded-md text-white hover:bg-aoi-900',
                        'outline-none focus:ring-2 focus:ring-aoi-400 focus:border-aoi-400',
                        'disabled:bg-gray-400 disabled:text-gray-800'
                    )}
                    disabled={total === 1}
                    onClick={() => goToPage(inputPage)}
                >
                    GO
                </button>
            </div>
        </div>
    )
}
