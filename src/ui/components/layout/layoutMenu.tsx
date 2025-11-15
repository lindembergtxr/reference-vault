import { NavLink } from 'react-router-dom'

import { cn } from '../../utils/classname'
import { useConfig } from '../../utils/configProvider'

const navbarItems = [
    { link: '', label: 'Home' },
    { link: 'search', label: 'Search' },
    { link: 'import', label: 'Import' },
]

export const LayoutMenu = () => {
    const { config } = useConfig()

    return (
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
                                isActive ? 'bg-tetsu-300 text-tetsu-900 dark:text-tetsu-900' : ''
                            )
                        }}
                    >
                        {item.label}
                    </NavLink>
                ))}
        </nav>
    )
}
