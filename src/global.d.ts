/// <reference types="@testing-library/jest-dom" />

type ConfigDataTheme = 'dark' | 'light'

type ConfigData = {
    theme: ConfigDataTheme
    outputDir: string | null
    thumbnailOutputDir: string | null
    lastOpenedFolder: string | null
}

type Tag = {
    id: string
    name: string
}

type ApiEventMapping = {
    getAllTags: Tag[]
    getConfig: ConfigData
}

interface Window {
    api: {
        getAllTags: () => Promise<Tag[]>
        getConfig: () => Promise<ConfigData>
    }
}
