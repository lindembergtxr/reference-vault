/// <reference types="@testing-library/jest-dom" />

type ConfigData = {
    theme: 'dark' | 'light'
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
