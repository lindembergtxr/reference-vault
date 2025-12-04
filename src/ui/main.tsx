import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './styles/index.css'

import './errorLogging.js'

import { Gallery, ImportPage, TagsPage } from './pages'
import { SettingsProvider } from './features/settings/index.js'
import { Layout } from './features/layout/layout.js'
import { ImageListContext } from './features/contexts/imageListContext.js'
import { TagsContext } from './features/contexts/tagsContext.js'
import { SettingsPage } from './pages/settings.js'

async function main() {
    const root = createRoot(document.getElementById('root')!)

    root.render(
        <StrictMode>
            <SettingsProvider>
                <HashRouter>
                    <ImageListContext>
                        <TagsContext>
                            <Routes>
                                <Route element={<Layout />}>
                                    <Route path="" element={<Gallery />} />
                                    <Route path="import" element={<ImportPage />} />
                                    <Route path="tags" element={<TagsPage />} />
                                    <Route path="settings" element={<SettingsPage />} />
                                </Route>
                            </Routes>
                        </TagsContext>
                    </ImageListContext>
                </HashRouter>
            </SettingsProvider>
            <Toaster />
        </StrictMode>
    )
}

main()
