import { SearchInput } from '../search/searchInput'
import { LayoutFolder } from './LayoutFolder'

export const LayoutSidebar = () => {
    return (
        <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr] gap-y-4 h-full">
            <div className="row-start-1 col-start-1 h-full">
                <LayoutFolder />
            </div>

            <div className="row-start-2 col-start-1 h-full">
                <SearchInput />
            </div>
        </div>
    )
}
