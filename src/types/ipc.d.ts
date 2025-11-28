type ApiEventMap = {
    getAllTags: { args: []; return: InternalTag[] }
    getConfig: { args: []; return: ConfigData }
    setTheme: { args: [ConfigDataTheme]; return: ConfigData }
    setDestinationFolder: { args: []; return: ConfigData }
    importFiles: { args: []; return: void }
    getStagedFiles: { args: []; return: InternalImage[] }
    getImageFiles: { args: []; return: InternalImage[] }
    createTags: { args: [InternalTagNew[]]; return: void }
    logError: { args: [LogErrorArgs]; return: void }
    commitImage: {
        args: [InternalImage<InternalTagNew>]
        return: { success: boolean; data?: { imageId: string }; error?: unknown }
    }
}

interface Window {
    api: {
        [K in keyof ApiEventMap]: (
            ...args: ApiEventMap[K]['args']
        ) => Promise<ApiEventMap[K]['return']>
    }
}
