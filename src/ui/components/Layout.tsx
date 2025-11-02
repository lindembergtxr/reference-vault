import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export const Layout = () => (
    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-black">
        <Navbar />
        <main className="content-container">
            <div className="content-inner">
                <Outlet />
            </div>
        </main>
    </div>
)
