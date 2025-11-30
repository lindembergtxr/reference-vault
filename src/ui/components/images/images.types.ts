export type EditableTag = InternalTag & {
    status: 'removed' | 'added' | 'original'
    isNew?: boolean
}
