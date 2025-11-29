import { NavLink } from 'react-router-dom'

import { cn } from '../../utils/classname'
import { useConfig } from '../../utils/configProvider'
import { Button } from 'react-aria-components'
import { MdOutlineRefresh } from 'react-icons/md'
import { useImageListContext } from '../contexts/imageListCore'
import { useTagsContext } from '../contexts/tagsCore'

const navbarItems = [
    { link: '', label: 'Home' },
    { link: 'tags', label: 'Tags' },
    { link: 'import', label: 'Import' },
]

export const LayoutMenu = () => {
    const { config } = useConfig()

    const { refreshTags } = useTagsContext()
    const { refreshImages } = useImageListContext()

    const refresh = () => {
        refreshImages()
        refreshTags()
    }

    return (
        <div className="flex h-full w-full items-center justify-between pr-4">
            <nav className="flex h-full gap-[2px]">
                {!!config?.outputDir &&
                    navbarItems.map((item) => (
                        <NavLink
                            key={item.link}
                            to={item.link}
                            className={({ isActive }) => {
                                return cn(
                                    'flex items-center gap-x-1 paragraph-lg font-medium py-2 px-4',
                                    'text-tetsu-900 dark:text-tetsu-300',
                                    'hover:bg-tetsu-300 hover:text-tetsu-900 dark:hover:text-tetsu-900',
                                    'outline-none focus:ring-2 focus:ring-offset-0 focus:ring-aoi-400',
                                    isActive
                                        ? 'bg-tetsu-300 text-tetsu-900 dark:text-tetsu-900'
                                        : ''
                                )
                            }}
                        >
                            {item.label}
                        </NavLink>
                    ))}
            </nav>

            <Button
                className="flex items-center gap-2 caption bg-aoi-900 text-aoi-100 py-2 px-3 rounded-md"
                onClick={refresh}
            >
                <MdOutlineRefresh className="h-4 w-4" /> Refresh data
            </Button>
        </div>
    )
}
