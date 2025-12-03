type ApiReturn<T = void> = {
    success: boolean
    data?: T
    error?: unknown
}

type ApiEventMap = {
    getAllTags: { args: []; return: InternalTag[] }
    getConfig: { args: []; return: ConfigData }
    setTheme: { args: [ConfigDataTheme]; return: ConfigData }
    setDestinationFolder: { args: []; return: ConfigData }
    importFiles: { args: []; return: void }
    getStagedFiles: { args: [GetImagesSearchArgs]; return: InternalImage[] }
    getImageFiles: { args: [GetImagesSearchArgs]; return: InternalImage[] }
    createTags: { args: [InternalTagNew[]]; return: void }
    addTagsToImage: {
        args: [ImageTagsChangeArgs]
        return: ApiReturn<{ imageId: string; tags: InternalTag[] }>
    }
    removeTagsFromImage: {
        args: [ImageTagsChangeArgs]
        return: ApiReturn<{ imageId: string; tags: InternalTag[] }>
    }
    removeTags: { args: [RemoveTagsPayload]; return: ApiReturn }
    logError: { args: [LogErrorArgs]; return: void }
    commitImage: {
        args: [InternalImage<InternalTagNew>]
        return: ApiReturn<{ imageId: string }>
    }
    deleteImage: { args: [string]; return: ApiReturn }
    countImages: { args: []; return: ApiReturn<number> }
    exportDB: { args: []; return: ApiReturn<{ path: string }> }
    generateHealthReport: { args: []; return: ApiReturn<HealthReport> }
    updateTag: { args: [InternalTag]; return: ApiReturn }
    getDuplicateImages: { args: []; return: InternalImage[] }
}

interface Window {
    api: {
        [K in keyof ApiEventMap]: (
            ...args: ApiEventMap[K]['args']
        ) => Promise<ApiEventMap[K]['return']>
    }
}
