import { TagsCreator } from '../components/tags/tagsCreator'

export const TagsPage = () => {
    return (
        <div className="flex flex-col gap-3 px-4 py-5 h-full">
            <TagsCreator />
        </div>
    )
}
