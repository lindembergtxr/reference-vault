import { Link } from 'react-router-dom'

import { LayoutFolder } from './LayoutFolder'
import { cn } from '../../utils/classname'
import { useConfig } from '../../utils/configProvider'

const navbarItems = [
    { link: '', label: 'Home' },
    { link: 'search', label: 'Search' },
    { link: 'import', label: 'Import' },
]

export const LayoutNavigation = () => {
    const { config } = useConfig()

    return (
        <div className="flex flex-col gap-2">
            <LayoutFolder />

            <nav className="flex flex-col gap-1">
                {!!config?.outputDir &&
                    navbarItems.map((item) => (
                        <Link
                            key={item.link}
                            to={item.link}
                            className={cn(
                                'flex items-center gap-x-1 paragraph-lg font-medium py-2 px-4',
                                'text-tetsu-900 dark:text-tetsu-300',
                                'hover:bg-tetsu-300 hover:text-tetsu-900 dark:hover:text-tetsu-900'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
            </nav>
        </div>
    )
}
