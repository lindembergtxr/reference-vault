import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './styles/index.css'

import { Navbar } from './components/navbar'
import { Home, Import } from './pages'

import './errorLogging.js'
import { ConfigProvider } from './components/ConfigProvider.js'

const main = async () => {
    const root = createRoot(document.getElementById('root')!)

    root.render(
        <StrictMode>
            <ConfigProvider>
                <BrowserRouter>
                    <Navbar />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/import" element={<Import />} />
                        <Route path="/search" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </ConfigProvider>
        </StrictMode>,
    )
}

main()
