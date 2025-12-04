import { NavLink } from 'react-router-dom'
import { Button } from 'react-aria-components'
import { MdOutlineRefresh } from 'react-icons/md'

import { cn } from '../../utils/classname'
import { useImageListContext } from '../contexts/imageListCore'
import { useTagsContext } from '../contexts/tagsCore'

const navbarItems = [
    { link: '', label: 'Gallery' },
    { link: 'tags', label: 'Tags' },
    { link: 'import', label: 'Import' },
    { link: 'settings', label: 'Settings' },
]

export const LayoutMenu = () => {
    const { refreshTags } = useTagsContext()

    const { refresh, committedImagesCount } = useImageListContext()

    const refreshData = () => {
        refresh()
        refreshTags()
    }

    return (
        <div className="flex h-full w-full items-center justify-between pr-4">
            <nav className="flex h-full gap-[2px]">
                {navbarItems.map((item) => (
                    <NavLink
                        key={item.link}
                        to={item.link}
                        className={({ isActive }) => {
                            return cn(
                                'flex items-center gap-x-1 paragraph-lg font-medium py-2 px-4',
                                'text-tetsu-900 dark:text-tetsu-300 outline-none',
                                'hover:bg-tetsu-300 hover:text-tetsu-900 dark:hover:text-tetsu-900',
                                'focus:bg-tetsu-300 focus:text-tetsu-900 focus:dark:text-tetsu-900',
                                isActive ? 'bg-tetsu-300 text-tetsu-900 dark:text-tetsu-900' : ''
                            )
                        }}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="flex items-center gap-4">
                <p className="text-xs font-mono truncate dark:text-tetsu-400">
                    Total of {committedImagesCount}{' '}
                    {committedImagesCount === 1 ? 'image' : 'images'}
                </p>

                <Button
                    className={cn(
                        'flex items-center justify-center py-2 px-4 gap-1 caption font-semibold',
                        'rounded outline-none bg-tetsu-800 text-tetsu-100 border',
                        'hover:bg-aoi-800 focus:ring-2 focus:ring-aoi-400 focus:border focus:border-aoi-400',
                        'dark:bg-tetsu-200 dark:text-tetsu-700 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-200'
                    )}
                    onClick={refreshData}
                >
                    <MdOutlineRefresh className="h-4 w-4" /> REFRESH
                </Button>
            </div>
        </div>
    )
}
