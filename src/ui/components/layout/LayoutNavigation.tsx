import { Link } from 'react-router-dom'

import { cn } from '../../utils/classname'

const navbarItems = [
    { link: '', label: 'Home' },
    { link: 'search', label: 'Search' },
    { link: 'import', label: 'Import' },
]

export const LayoutNavigation = () => {
    return (
        <div className="flex flex-col gap-2">
            <nav className="flex flex-col gap-1">
                {navbarItems.map((item) => (
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
