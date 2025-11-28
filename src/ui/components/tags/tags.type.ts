export type CSVTag = Omit<InternalTagNew, 'id'> & {
    category: TagCategory
    franchise: string
    line: number
    error?: string
}
