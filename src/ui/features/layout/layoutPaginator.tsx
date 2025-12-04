import { useLocation } from 'react-router-dom'

import { Pagination } from '../../components/paginator'
import { useImageListContext } from '../contexts/imageListCore'

export const LayoutPaginator = () => {
    const location = useLocation()
    const currentPath = location.pathname
    const { page, totalPages, setPage } = useImageListContext()

    if (currentPath !== '/') return null

    return <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
}
