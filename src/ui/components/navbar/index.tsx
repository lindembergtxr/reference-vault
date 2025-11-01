import { MdDarkMode, MdLightMode } from 'react-icons/md'

export const Navbar = ({ theme }: { theme: ConfigDataTheme }) => {
    const toggleTheme = () => {
        // add logic to toggle theme
    }

    return (
        <header className="header-container">
            <div className="header-inner py-2">
                <div className="row-span-1">Logo</div>

                <nav className="col-span-11 row-span-1 row-start-2 flex gap-4">
                    <a href="/" className="flex items-center gap-x-1">
                        Home
                    </a>
                    <a href="/search" className="flex items-center gap-x-1">
                        Search
                    </a>
                    <a href="/import" className="flex items-center gap-x-1">
                        Import
                    </a>
                </nav>

                <div className="col-span-1 row-span-1 row-start-2 flex justify-end">
                    <button onClick={toggleTheme}>
                        {theme === 'dark' ? <MdDarkMode /> : <MdLightMode />}
                    </button>
                </div>
            </div>
        </header>
    )
}
