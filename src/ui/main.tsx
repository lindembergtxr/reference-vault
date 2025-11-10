import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'

import './styles/index.css'

import './errorLogging.js'
import { Home, Import } from './pages'
import { ConfigProvider } from './components/ConfigProvider.js'
import { Layout } from './components/layout/Layout.js'

const main = async () => {
    const root = createRoot(document.getElementById('root')!)

    root.render(
        <StrictMode>
            <ConfigProvider>
                <HashRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="" element={<Home />} />
                            <Route path="import" element={<Import />} />
                            <Route path="search" element={<Home />} />
                        </Route>
                    </Routes>
                </HashRouter>
            </ConfigProvider>
        </StrictMode>
    )
}

main()
