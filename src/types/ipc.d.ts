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
        return: {
            success: boolean
            data?: { imageId: string; tags: InternalTag[] }
            error?: unknown
        }
    }
    removeTagsFromImage: {
        args: [ImageTagsChangeArgs]
        return: {
            success: boolean
            data?: { imageId: string; tags: InternalTag[] }
            error?: unknown
        }
    }
    removeTags: {
        args: [RemoveTagsPayload]
        return: { success: boolean; error?: unknown }
    }
    logError: { args: [LogErrorArgs]; return: void }
    commitImage: {
        args: [InternalImage<InternalTagNew>]
        return: { success: boolean; data?: { imageId: string }; error?: unknown }
    }
    deleteImage: {
        args: [string]
        return: { success: boolean; data?: void; error?: unknown }
    }
    countImages: {
        args: []
        return: { success: boolean; data?: number; error?: unknown }
    }
}

interface Window {
    api: {
        [K in keyof ApiEventMap]: (
            ...args: ApiEventMap[K]['args']
        ) => Promise<ApiEventMap[K]['return']>
    }
}
