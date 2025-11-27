import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'

import './styles/index.css'

import './errorLogging.js'

import { HomePage, ImportPage, TagsPage } from './pages'
import { ConfigProvider } from './components/ConfigProvider.js'
import { Layout } from './components/layout/Layout.js'
import { ImageListContext } from './components/contexts/imageListContext.js'
import { TagsContext } from './components/contexts/tagsContext.js'

const main = async () => {
    const root = createRoot(document.getElementById('root')!)

    root.render(
        <StrictMode>
            <ConfigProvider>
                <HashRouter>
                    <ImageListContext>
                        <TagsContext>
                            <Routes>
                                <Route element={<Layout />}>
                                    <Route path="" element={<HomePage />} />
                                    <Route path="import" element={<ImportPage />} />
                                    <Route path="tags" element={<TagsPage />} />
                                </Route>
                            </Routes>
                        </TagsContext>
                    </ImageListContext>
                </HashRouter>
            </ConfigProvider>
        </StrictMode>
    )
}

main()
