import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'

import { Navbar } from './components/navbar'
import { Home, Import } from './pages'

import './errorLogging.js'

const main = async () => {
    const config = await window.api.getConfig()

    const theme = config.theme

    const root = createRoot(document.getElementById('root')!)

    root.render(
        <StrictMode>
            <BrowserRouter>
                <Navbar theme={theme} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/import" element={<Import />} />
                    <Route path="/search" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </StrictMode>,
    )
}

main()
