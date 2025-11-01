type ApiEventMap = {
    getAllTags: { args: []; return: InternalTag[] }
    getConfig: { args: []; return: ConfigData }
    setTheme: { args: [ConfigDataTheme]; return: ConfigData }
    importFiles: { args: []; return: void }
    getStagedFiles: { args: []; return: InternalImage[] }
    logError: { args: [LogErrorArgs]; return: void }
}

interface Window {
    api: {
        [K in keyof ApiEventMap]: (
            ...args: ApiEventMap[K]['args']
        ) => Promise<ApiEventMap[K]['return']>
    }
}
