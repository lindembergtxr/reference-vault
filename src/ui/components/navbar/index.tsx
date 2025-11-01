import { MdDarkMode, MdLightMode } from 'react-icons/md'

import { useConfig } from '../../utils/configProvider'

export const Navbar = () => {
    const { config, toggleTheme } = useConfig()

    const theme = config?.theme ?? null

    return (
        <header className="header-container">
            <div className="header-inner py-2">
                <div className="row-span-1 text-aoi-600 dark:text-aoi-200">Logo</div>

                <nav className="col-span-11 row-span-1 row-start-2 flex gap-4">
                    <a
                        href="/"
                        className="flex items-center gap-x-1 text-aoi-600 dark:text-aoi-400"
                    >
                        Home
                    </a>
                    <a
                        href="/search"
                        className="flex items-center gap-x-1 text-aoi-600 dark:text-aoi-400"
                    >
                        Search
                    </a>
                    <a
                        href="/import"
                        className="flex items-center gap-x-1 text-aoi-600 dark:text-aoi-400"
                    >
                        Import
                    </a>
                </nav>

                <div className="col-span-1 row-span-1 row-start-2 flex justify-end">
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
