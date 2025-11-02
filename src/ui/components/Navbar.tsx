import { MdDarkMode, MdLightMode } from 'react-icons/md'

import { useConfig } from '../utils/configProvider'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    const { config, toggleTheme } = useConfig()

    const theme = config?.theme ?? null

    return (
        <header className="header-container">
            <div className="header-inner py-2">
                <nav className="col-span-11 row-span-1 row-start-1 flex gap-4">
                    <Link
                        to=""
                        className="flex items-center gap-x-1 paragraph-lg font-medium text-aoi-600 dark:text-aoi-400"
                    >
                        Home
                    </Link>
                    <Link
                        to="search"
                        className="flex items-center gap-x-1 paragraph-lg font-medium text-aoi-600 dark:text-aoi-400"
                    >
                        Search
                    </Link>
                    <Link
                        to="import"
                        className="flex items-center gap-x-1 paragraph-lg font-medium text-aoi-600 dark:text-aoi-400"
                    >
                        Import
                    </Link>
                </nav>

                <div className="col-span-1 row-span-1 row-start-1 flex justify-end">
                    <button onClick={toggleTheme}>
                        {theme === 'dark' ? (
                            <MdDarkMode className="text-aoi-400" />
                        ) : (
                            <MdLightMode className="text-aoi-600" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}
