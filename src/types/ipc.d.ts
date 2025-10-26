type ApiEventMap = {
    getAllTags: { args: []; return: Tag[] }
    getConfig: { args: []; return: ConfigData }
    importFiles: { args: []; return: void }
    getStagedFiles: { args: []; return: string[] }
    logError: { args: [LogErrorArgs]; return: void }
}

interface Window {
    api: {
        [K in keyof ApiEventMap]: (
            ...args: ApiEventMap[K]['args']
        ) => Promise<ApiEventMap[K]['return']>
    }
}
