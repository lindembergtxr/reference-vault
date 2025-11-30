import { NavLink } from 'react-router-dom'

import { cn } from '../../utils/classname'
import { useConfig } from '../../utils/configProvider'
import { Button } from 'react-aria-components'
import { MdOutlineRefresh } from 'react-icons/md'
import { useImageListContext } from '../contexts/imageListCore'
import { useTagsContext } from '../contexts/tagsCore'
import { useEffect, useState } from 'react'

const navbarItems = [
    { link: '', label: 'Home' },
    { link: 'tags', label: 'Tags' },
    { link: 'import', label: 'Import' },
]

export const LayoutMenu = () => {
    const { config } = useConfig()

    const [count, setCount] = useState(0)

    const { refreshTags } = useTagsContext()
    const { refreshImages } = useImageListContext()

    const refresh = () => {
        refreshImages()
        refreshTags()
    }

    useEffect(() => {
        window.api.countImages().then((res) => {
            if (res.success && res.data && typeof res.data === 'number') setCount(res.data ?? 0)
        })
    }, [])

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

            <div className="flex items-center gap-4">
                <p className="text-xs font-mono truncate dark:text-tetsu-400">
                    Total of {count} {count === 1 ? 'image' : 'images'}
                </p>

                <Button
                    className={cn(
                        'flex items-center justify-center py-2 px-4 gap-1 caption font-semibold',
                        'rounded outline-none bg-tetsu-800 text-tetsu-100',
                        'hover:bg-aoi-800 focus:ring-2 focus:ring-aoi-400 focus:border focus:border-aoi-400',
                        'dark:bg-tetsu-200 dark:text-tetsu-700 dark:hover:bg-tetsu-700 dark:hover:text-tetsu-200'
                    )}
                    onClick={refresh}
                >
                    <MdOutlineRefresh className="h-4 w-4" /> REFRESH
                </Button>
            </div>
        </div>
    )
}
