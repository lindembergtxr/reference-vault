export type CSVTag = InternalTagNew & {
    category: TagCategory
    franchise: string
    line: number
    error?: string
}

export type LocalTag = InternalTag & {
    mode: 'include' | 'exclude'
}
