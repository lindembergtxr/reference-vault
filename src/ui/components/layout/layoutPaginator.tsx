import { Pagination } from '../common/paginator'
import { useImageListContext } from '../contexts/imageListCore'

export const LayoutPaginator = () => {
    const { page, totalPages, setPage } = useImageListContext()

    return <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
}
