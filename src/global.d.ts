type Tag = {
    id: string
    name: string
}

type ApiEventMapping = {
    getAllTags: Tag[]
}

interface Window {
    api: {
        getAllTags: () => Promise<Tag[]>
    }
}
