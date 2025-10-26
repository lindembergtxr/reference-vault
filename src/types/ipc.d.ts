type ApiEventMap = {
    getAllTags: Tag[]
    getConfig: ConfigData
    importFiles: void
    getStagedFiles: string[]
}

interface Window {
    api: {
        [K in keyof ApiEventMap]: () => Promise<ApiEventMap[K]>
    }
}
