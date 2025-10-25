import { MdDarkMode, MdLightMode } from 'react-icons/md'

export const Navbar = ({ theme }: { theme: ConfigDataTheme }) => {
    const toggleTheme = () => {
        // add logic to toggle theme
    }

    return (
        <header className="flex flex-col gap-y-2 px-6 py-1 shadow-lg border-b-1">
            <div className="flex items-center h-10">Logo</div>
            <div className="flex items-center justify-between h-6">
                <nav className="flex items-center gap-x-4 h-6">
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

                <button onClick={toggleTheme}>
                    {theme === 'dark' ? <MdDarkMode /> : <MdLightMode />}
                </button>
            </div>
        </header>
    )
}
